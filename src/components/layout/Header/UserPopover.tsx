import React from "react";

export interface UserPopoverProps {
  userName?: string;
  userAvatar?: string;
  userEmail?: string;
  onLogout: () => void;
}

export const UserPopover: React.FC<UserPopoverProps> = ({
  userName,
  userAvatar,
  userEmail,
  onLogout
}) => {
  return (
    <div className="user-popover" id="user-popover">
      <div className="user-info" style={{ display: 'flex', alignItems: 'center' }}>
        {userAvatar && (
          <img src={userAvatar} alt="" className="user-popover-avatar" />
        )}
        <div className="user-details">
          {userName && <span className="user-name">{userName}</span>}
            {userEmail && <span className="user-email">{userEmail}</span>}
        </div>
        <div className="user-actions">
          <button className="logout-button" onClick={onLogout} type="button">
            Logout
          </button>
        </div>

      </div>
    </div>
  );
};