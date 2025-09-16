import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

export type ThemeMode = "light" | "dark"

interface ThemeContextValue {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const STORAGE_KEY = "kdrive-theme"

function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "light"
  }

  const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null
  if (stored === "light" || stored === "dark") {
    return stored
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  return prefersDark ? "dark" : "light"
}

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeMode>(getInitialTheme)
  const [hasManualPreference, setHasManualPreference] = useState(() => {
    if (typeof window === "undefined") {
      return false
    }
    return window.localStorage.getItem(STORAGE_KEY) !== null
  })

  useEffect(() => {
    if (typeof document === "undefined") {
      return
    }

    const root = document.documentElement
    root.classList.toggle("dark", theme === "dark")
    root.dataset.theme = theme
    root.style.colorScheme = theme

    if (typeof window !== "undefined") {
      if (hasManualPreference) {
        window.localStorage.setItem(STORAGE_KEY, theme)
      } else {
        window.localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [theme, hasManualPreference])

  useEffect(() => {
    if (typeof window === "undefined" || hasManualPreference) {
      return
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (event: MediaQueryListEvent) => {
      setThemeState(event.matches ? "dark" : "light")
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [hasManualPreference])

  const setTheme = useCallback((value: ThemeMode) => {
    setHasManualPreference(true)
    setThemeState(value)
  }, [])

  const toggleTheme = useCallback(() => {
    setHasManualPreference(true)
    setThemeState((current) => (current === "dark" ? "light" : "dark"))
  }, [])

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
    }),
    [theme, setTheme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
