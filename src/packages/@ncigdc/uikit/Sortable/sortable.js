import React from 'react';
import PropTypes from 'prop-types';
import { swapArrayElements, isMouseBeyond } from './helpers';

export function sortable(Component) {
  class Sortable extends React.Component {
    updateEdge = true;

    state = { draggingIndex: null };

    componentWillReceiveProps(nextProps) {
      this.setState({
        draggingIndex: nextProps.draggingIndex,
      });
    }

    sortEnd = e => {
      e.preventDefault();
      this.props.updateState({
        draggingIndex: null,
      });
    };

    sortStart = e => {
      const draggingIndex = e.currentTarget.dataset.id;
      this.props.updateState({
        draggingIndex,
      });

      this.setState({
        draggingIndex,
      });

      const dt = e.dataTransfer;
      if (dt !== undefined) {
        e.dataTransfer.setData('text', e.target.innerHTML);

        // fix http://stackoverflow.com/questions/27656183/preserve-appearance-of-dragged-a-element-when-using-html5-draggable-attribute
        if (dt.setDragImage && e.currentTarget.tagName.toLowerCase() === 'a') {
          dt.setDragImage(e.target, 0, 0);
        }
      }
      this.updateEdge = true;
    };

    dragOver = e => {
      e.preventDefault();
      let mouseBeyond;
      let positionX;
      let positionY;
      let height;
      let topOffset;
      let { items } = this.props;
      const { moveInMiddle, outline } = this.props;
      const overEl = e.currentTarget; // underlying element
      const indexDragged = Number(overEl.dataset.id); // index of underlying element in the set DOM elements
      const indexFrom = Number(this.state.draggingIndex);

      height = overEl.getBoundingClientRect().height;

      positionX = e.clientX;
      positionY = e.clientY;
      topOffset = overEl.getBoundingClientRect().top;

      if (outline === 'list') {
        mouseBeyond = isMouseBeyond(positionY, topOffset, height, moveInMiddle);
      }

      if (outline === 'grid') {
        mouseBeyond = isMouseBeyond(
          positionX,
          overEl.getBoundingClientRect().left,
          overEl.getBoundingClientRect().width,
          moveInMiddle,
        );
      }

      if (indexDragged !== indexFrom && mouseBeyond) {
        items = swapArrayElements(items, indexFrom, indexDragged);
        this.props.updateState({
          items,
          draggingIndex: indexDragged,
        });
      }
    };

    isDragging() {
      const { draggingIndex, sortId } = this.props;
      return draggingIndex === sortId;
    }

    render() {
      const draggingClassName = `${Component.displayName}-dragging`;
      return (
        <Component
          children={this.props.children}
          className={this.isDragging() ? draggingClassName : ''}
          data-id={this.props.sortId}
          draggable
          onDragEnd={this.sortEnd}
          onDragOver={this.dragOver}
          onDragStart={this.sortStart}
          onDrop={this.sortEnd}
          onTouchEnd={this.sortEnd}
          onTouchMove={this.dragOver}
          onTouchStart={this.sortStart}
          {...this.props.childProps || {}}
          />
      );
    }
  }

  Sortable.propTypes = {
    childProps: PropTypes.object,
    items: PropTypes.array.isRequired,
    outline: PropTypes.string.isRequired,
    sortId: PropTypes.number, // list | grid
    updateState: PropTypes.func.isRequired,
  };

  Sortable.defaultProps = {
    moveInMiddle: false,
  };

  return Sortable;
}
