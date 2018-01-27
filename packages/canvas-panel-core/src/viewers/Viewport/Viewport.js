import React, { Component } from 'react';

class Viewport extends Component {
  state = {
    x: 0,
    y: 0,
    zoom: 1,
    scale: 1,
    rotation: 0,
  };

  componentDidMount() {
    if (this.props.setRef) {
      this.props.setRef(this);
    }
  }

  componentWillReceiveProps(newProps) {
    if (this.props.setRef !== newProps.setRef) {
      newProps.setRef(this);
    }
  }

  onUpdateViewport = ({ x, y, zoom, scale, rotation }) => {
    this.setState({
      x,
      y,
      zoom,
      scale,
      rotation,
    });
  };

  viewer = null;

  getRef = viewer => {
    this.viewer = viewer;
  };

  goToRect = (bounds, padding, speed) => {
    if (this.viewer && this.viewer.goToRect) {
      this.viewer.goToRect(bounds, padding, speed);
    }
  };

  resetView = speed => {
    if (this.viewer && this.viewer.resetView) {
      this.viewer.resetView(speed);
    }
  };

  render() {
    const { x, y, zoom, scale, rotation } = this.state;
    const { maxWidth, maxHeight, children, style, ...props } = this.props;

    return (
      <div
        style={{
          maxWidth,
          maxHeight,
          position: 'relative',
          display: 'inline-block',
          overflow: 'hidden',
          width: '100%',
          ...style,
        }}
      >
        {React.Children.map(children, child => {
          if (child.props.viewportController === true) {
            return React.cloneElement(child, {
              getPosition: this.onUpdateViewport,
              getRef: this.getRef,
              maxWidth,
              maxHeight,
              ...props,
            });
          }
          const ratio = child.props.ratio || child.props.scale || 1;
          return React.cloneElement(child, {
            style: {
              transform: `translate(${x}px,${y}px) scale(${zoom *
                scale /
                ratio}) rotate(${rotation})`,
              transformOrigin: '0 0 0',
              maxHeight,
              ...child.props.style,
              width: this.props.width * ratio,
              height: this.props.height * ratio,
              position: 'absolute',
              top: 0,
              left: 0,
            },
            position: {
              x: x * ratio,
              y: y * ratio,
              zoom,
              scale: scale / ratio,
              rotation,
            },
            maxWidth,
            ...props,
          });
        })}
      </div>
    );
  }
}

export default Viewport;