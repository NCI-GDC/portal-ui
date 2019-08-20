import React from 'react';
import { get } from 'lodash';
import './DragAndDropGroupList.css';

export interface IGroupListItemProps {
  [groupName: string]: {
    count: number,
    index: number,
    subList: string[],
  }
}

export interface IUpdateStateProps {
  draggingIndex: number | null,
  items?: IGroupListItemProps[],
  prevDraggingIndex?: number,
}

export interface IMergingProps {
  draggingIndex: number | null,
  targetSubItems: string[],
  currSubItems: string[],
  targetGroupName: string,
}

export interface IDraggingProps {
  'data-id': string,
  draggable: boolean,
  key: string,
  onDragEnd: (e: DragEvent) => void,
  onDragOver: (e: DragEvent) => void,
  onDragStart: (e: DragEvent) => void,
  onDrop: (e: DragEvent) => void,
  onTouchEnd: (e: DragEvent) => void,
  onTouchMove: (e: DragEvent) => void,
  onTouchStart: (e: DragEvent) => void,
  tabIndex: number,
}
interface IProps {
  updateState: (props: IUpdateStateProps) => void,
  merging: (props: IMergingProps) => void,
  unGroup: (props: {key: string}) => void,
  Component: (props:any) => JSX.Element,
  draggingIndex: number | null,
  SubComponent: ({
    draggingProps,
    key,
    subItem,
  }: {
    draggingProps:{
      'data-id': string,
      draggable: boolean,
      onDragEnd: (e: DragEvent) => void,
      onDragStart: (e: DragEvent) => void,
      onDrop: (e: DragEvent) => void,
      onTouchEnd: (e: DragEvent) => void,
      onTouchStart: (e: DragEvent) => void,
      onDragOver: (e: DragEvent) => void,
    },
    key: string,
    subItem: string,
  }) => JSX.Element,
  customProps?: any,
  style?: React.CSSProperties,
  items: IGroupListItemProps[],
}

interface IState {
  isDragging: boolean,
  draggingIndex: null | number,
  parentDraggable: boolean,
  subIsDragging: boolean,
  selectedSub: string,
  indexDragged: null | number,
}
export default class DragAndDropGroupList extends React.Component<IProps, IState> {
  state = {
    draggingIndex: null,
    indexDragged: null,
    isDragging: false,
    parentDraggable: true,
    selectedSub: '',
    subIsDragging: false,
  };

  componentWillReceiveProps(nextProps: IProps) {
    this.setState({
      draggingIndex: nextProps.draggingIndex,
    });
  }


  sortStart = (e: DragEvent) => {
    const { parentDraggable } = this.state;
    if (parentDraggable) {
      const draggingIndex = Number(get(e, 'currentTarget.dataset.id', null));
      const { updateState } = this.props;
      updateState({
        draggingIndex,
      });
      const dt = e.dataTransfer;
      if (dt) {
        dt.setData('text', get(e, 'target.innerHTML', ''));

      // fix http://stackoverflow.com/questions/27656183/preserve-appearance-of-dragged-a-element-when-using-html5-draggable-attribute
        if (dt.setDragImage && e.currentTarget) {
          const currentTarget = e.currentTarget as HTMLElement;
          if (currentTarget.tagName.toLowerCase() === 'a' && e.target) {
            const target = e.target as HTMLElement;
            dt.setDragImage(target, 0, 0);
          }
        }
      }
    }
  };

  dragOver = (e:DragEvent) => {
    const { parentDraggable } = this.state;
    const overEl = e.currentTarget as HTMLElement; // underlying element
    if (!overEl || !parentDraggable) {
      return;
    }
    this.setState({
      indexDragged: Number(overEl.dataset.id),
      isDragging: true,
    });
  };


  sortEnd = (e: DragEvent) => {
    e.preventDefault();
    this.setState({
      indexDragged: null,
      isDragging: false,
    });
    const { draggingIndex, indexDragged, parentDraggable } = this.state;
    const { items, merging, updateState } = this.props;
    if (!parentDraggable) {
      return;
    }
    const overEl = e.currentTarget as HTMLElement; // underlying element

    if (!overEl || typeof indexDragged !== 'number') {
      return;
    }
    const indexFrom = Number(draggingIndex);
    const { left, width } = overEl.getBoundingClientRect();
    const positionX = e.clientX;
    const targetGroupName = Object.keys(items[indexDragged])[0];
    const targetSubItems = Object.values(items[indexDragged])[0].subList;
    const currSubItems = Object.values(items[indexFrom])[0].subList;

    if (indexDragged !== indexFrom) {
      const isMouseCross = positionX - left > width / 5;
      const isTargetAGroup = targetSubItems.length > 1 || targetGroupName !== targetSubItems[0];
      if (isTargetAGroup && isMouseCross) {
        merging({
          currSubItems,
          draggingIndex: indexDragged,
          targetGroupName,
          targetSubItems,
        });
        return;
      }
      items.splice(indexDragged, 0, items.splice(indexFrom, 1)[0]);
      updateState({
        draggingIndex: null,
        items,
        prevDraggingIndex: indexFrom,
      });
    }
  };

  subItemDragStart = (e: DragEvent) => {
    const itemKey = get(e, 'currentTarget.dataset.id', undefined);
    this.setState({
      parentDraggable: false,
      selectedSub: itemKey,
    });
  }

  subItemDragOver = () => {
    const { subIsDragging } = this.state;
    if (!subIsDragging) {
      this.setState({
        subIsDragging: true,
      });
    }
  }

  subItemDragEnd = (e: DragEvent) => {
    e.stopPropagation();
    const { unGroup, updateState } = this.props;
    this.setState({
      isDragging: false,
      parentDraggable: true,
      selectedSub: '',
      subIsDragging: false,
    });
    const itemKey = get(e, 'currentTarget.dataset.id', undefined);
    if (!itemKey) {
      return;
    }
    const target = e.currentTarget as HTMLElement;
    if (!target) {
      return;
    }
    const parentTarget = target.parentElement;
    if (!parentTarget) {
      return;
    }
    const positionY = e.clientY;
    const targetHeight = target.getBoundingClientRect().height;
    const parentTop = parentTarget.getBoundingClientRect().top;
    const parentHeight = parentTarget.getBoundingClientRect().height;
    const mouseBeyond = positionY > parentTop + parentHeight + targetHeight;
    if (mouseBeyond) {
      unGroup({ key: itemKey });
    }
    updateState({
      draggingIndex: null,
    });
  }

  render() {
    const {
      Component,
      customProps,
      items,
      SubComponent,
    } = this.props;
    const { isDragging, selectedSub, subIsDragging, indexDragged, draggingIndex } = this.state;
    return (
      <React.Fragment>
        <div className={isDragging ? 'sort' : undefined}>
          {items.map((groupObj, i) => {
            const keys = Object.keys(groupObj);
            const groupName = keys[0];
            const group = Object.values(groupObj)[0].subList;
            return (
              <Component
                draggingProps={{
                  'data-id': i,
                  draggable: true,
                  key: groupName,
                  onDragEnd: this.sortEnd,
                  onDragOver: this.dragOver,
                  onDragStart: this.sortStart,
                  onDrop: this.sortEnd,
                  onTouchEnd: this.sortEnd,
                  onTouchMove: this.dragOver,
                  onTouchStart: this.sortStart,
                  tabIndex: i,
                  className: ((draggingIndex === i) ? 'select' : undefined),
                }}
                group={group}
                groupName={groupName}
                key={groupName}
                {...customProps}
                >
                {(group.length > 1 || group[0] !== groupName) &&
                  (
                    <div className={group.includes(selectedSub) && subIsDragging ? 'group' : undefined}>
                      {group.map(subItem => (
                        <SubComponent
                          draggingProps={{
                            'data-id': subItem,
                            draggable: true,
                            onDragEnd: this.subItemDragEnd,
                            onDragOver: this.subItemDragOver,
                            onDragStart: this.subItemDragStart,
                            onDrop: this.subItemDragEnd,
                            onTouchEnd: this.subItemDragEnd,
                            onTouchStart: this.subItemDragStart,
                          }}
                          key={subItem}
                          subItem={subItem}
                          />
                      ))}
                    </div>
                  )}
                  <div
                    className={ 
                      ((indexDragged === i && draggingIndex !== indexDragged) ? 
                      'pending' : undefined)
                    }
                  />
              </Component>
            );
          })}
        </div>
      </React.Fragment>

    );
  }
}
