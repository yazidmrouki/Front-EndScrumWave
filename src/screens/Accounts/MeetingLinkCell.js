import React from 'react';

function MeetingLinkCell({ row }) {
  const isNullMeetingLink = row.meetingLink === null || row.meetingLink === undefined || row.meetingLink.trim() === '';
  const meetingLinkClass = isNullMeetingLink ? 'meeting-link-cell red-blink' : 'meeting-link-cell';

  return (
    <div className={meetingLinkClass}>
      {isNullMeetingLink ? (
        <span> Add UrlMeeting At {row.time} </span>
      ) : (
        <a href={row.meetingLink} target="_blank" rel="noopener noreferrer">
          {row.meetingLink.length > 30 ? `${row.meetingLink.substring(0, 30)}...` : row.meetingLink}
        </a>
      )}
    </div>
  );
}

export default MeetingLinkCell;
