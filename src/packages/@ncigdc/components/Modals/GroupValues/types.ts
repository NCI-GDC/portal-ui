import { ReactNode } from 'react';

export interface IBinProps {
  key: string,
  doc_count: number,
  groupName: string,
  index: number,
}

export interface IState {
  draggingIndex: number | null;
  items: string[];
  merged:boolean;
  prevDraggingIndex: number;
  group:any;
}

export interface ISelectedBinsProps {
  [x: string]: boolean
}

export interface IBinsProps { 
  [x: string]: IBinProps 
}

export interface IGroupValuesModalProps {
  binGrouping: (selectedGroupBins: { [x: string]: boolean }) => void,
  currentBins: IBinsProps,
  dataBuckets: IBinProps[],
  setCurrentBins: (currentBins: IBinsProps) => void,
  onUpdate: (bins: IBinsProps) => void,
  onClose: () => void,
  fieldName: string,
  selectedHidingBins: ISelectedBinsProps,
  setSelectedHidingBins: (selectedHidingBins: ISelectedBinsProps) => void,
  selectedGroupBins: ISelectedBinsProps,
  setSelectedGroupBins: (selectedGroupBins: ISelectedBinsProps) => void,
  editingGroupName: string,
  setEditingGroupName: (editingGroupName: string) => void,
  children?: ReactNode,
  globalWarning: string,
  setGlobalWarning: (globalWarning: string) => void,
  setListWarning: (listWarning: { [x: string]: string }) => void,
  listWarning: { [x: string]: string },
  setDraggingIndex: (draggingIndex: number | null) => void,
  draggingIndex: number,
  groupNameMapping: any,
  setShift: (x: boolean) => void,
  shift: boolean,
}