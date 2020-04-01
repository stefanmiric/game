import React from 'react';
import "./Player.css";

const Player = ({ player: { id, name, color, position, fieldIndex }, inField = false}) => {
    return (
      <div className="player" style={{
        backgroundColor: color,
        position: inField ? 'static' : 'absolute',
        left: position.left + 35,
        top: position.top + 35,
        visibility: (!inField && (fieldIndex === 0 || fieldIndex === 51)) ? 'hidden' : 'visible'
      }}>
        {name.substr(0, 1)}
      </div>
    )
};

export default Player
