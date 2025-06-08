// src/types/drive.ts
export type DriveFolder = {
    id: string
    name: string
    type: 'folder'
    path: string
  }
  export type DriveFile = {
    id: string
    name: string
    type: 'file'
    size: string
    modified: string
  }
  export type DriveItem = DriveFolder | DriveFile
  
  export interface DriveData {
    name: string
    items: DriveItem[]
  }
  export const mockData: Record<string, DriveData> = {}
  