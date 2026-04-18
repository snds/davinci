import React from 'react';
import Avatar from './Avatar';
import Icon from './Icon';
import Button from './Button';

function Post({ author, role, time, avatar, variant = 'g1', photoSeed, isCompany, body, attachment, reactions, comments, liked, onLike }) {
  return (
    <section className="panel">
      <div className="post">
        <div className="post__header">
          <Avatar
            initials={avatar}
            size={48}
            variant={variant}
            photoSeed={photoSeed}
            style={isCompany ? { borderRadius: 8 } : null}
          />
          <div className="post__who">
            <div className="post__name">{author}</div>
            <div className="post__role">{role}</div>
            <div className="post__time">
              {time} <span className="dot-sep" /> <Icon name="public" style={{ fontSize: 12 }} />
            </div>
          </div>
          <Button variant="ghost" size="sm" style={{ padding: 4 }}>
            <Icon name="more_horiz" />
          </Button>
        </div>
        <div className="post__body">{body}</div>
        {attachment && (
          <div className="post__attachment">
            <div
              className="post__attachment-img"
              style={attachment.image
                ? { backgroundImage: `url(${attachment.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                : attachment.style}
            ></div>
            <div className="post__attachment-body">
              <strong>{attachment.title}</strong>
              <span className="meta">{attachment.sub}</span>
            </div>
          </div>
        )}
        <div className="post__reactions">
          <span>
            <span style={{ color: 'var(--accent-fg)' }}>❤ 👍 💡</span>
            &nbsp;&nbsp;{reactions} reactions
          </span>
          <span>{comments} comments</span>
        </div>
        <div className="post__actions">
          <button className={`post__action ${liked ? 'active' : ''}`} onClick={onLike}>
            <Icon name="thumb_up" filled={liked} />
            <span>Like</span>
          </button>
          <button className="post__action"><Icon name="chat_bubble" /><span>Comment</span></button>
          <button className="post__action"><Icon name="repeat" /><span>Repost</span></button>
          <button className="post__action"><Icon name="send" /><span>Send</span></button>
        </div>
      </div>
    </section>
  );
}

export default Post;
