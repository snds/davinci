// Feed composer + post card

function Composer({ onStartPost }) {
  const actions = [
    { icon: 'image', label: 'Photo', color: 'var(--accent-fg)' },
    { icon: 'play_circle', label: 'Video', color: 'var(--success-fg)' },
    { icon: 'event', label: 'Event', color: 'var(--warning-fg)' },
    { icon: 'article', label: 'Article', color: 'var(--danger-fg)' },
  ];
  return (
    <section className="panel">
      <div className="composer">
        <Avatar initials="YO" size={48} variant="g1" photo={seededPhoto('yara-okonkwo', 96, 96, 'face')} />
        <div className="composer__input" onClick={onStartPost}>Share an update, Yara…</div>
      </div>
      <div className="composer__actions">
        {actions.map((a, i) => (
          <div key={i} className="composer__action">
            <Icon name={a.icon} style={{ color: a.color }} />
            <span>{a.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

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
            <div className="post__time">{time} <span className="dot-sep" /> <Icon name="public" style={{ fontSize: 12 }} /></div>
          </div>
          <Button variant="ghost" size="sm" style={{ padding: 4 }}><Icon name="more_horiz" /></Button>
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

function Feed({ onOpenProfile, onOpenCompany }) {
  const [likes, setLikes] = useState({});
  const toggleLike = (i) => setLikes(s => ({ ...s, [i]: !s[i] }));

  const posts = [
    {
      author: 'Sofia Antonova',
      role: 'Staff Designer at Helix · 2nd',
      time: '2h',
      avatar: 'SA',
      variant: 'g4',
      photoSeed: 'Sofia Antonova',
      body: 'Shipping a refresh of our component library today. Fewer tokens, warmer neutrals, and — finally — a proper focus ring on every interactive surface.\n\nSome lessons along the way:',
      attachment: {
        title: 'Radix Colors for design systems that age well',
        sub: 'davinci-systems.com · 8 min read',
        image: seededPhoto('article-radix-colors', 480, 240, 'article'),
      },
      reactions: 482,
      comments: 34,
    },
    {
      author: 'Helix Systems',
      role: 'Product & Design Platform · 24,802 followers',
      time: '5h',
      avatar: 'HX',
      variant: 'g2',
      isCompany: true,
      // Companies keep geometric monogram — no photoSeed.
      body: 'We\'re hiring a Design Engineer to work on our token pipeline. Based in Lisbon or fully remote.\n\nApply or refer someone great — this person will define the next chapter of our design platform.',
      attachment: {
        title: 'Design Engineer · Helix Platform Team',
        sub: 'Remote / Lisbon · 5 days ago · 48 applicants',
        style: { background: 'linear-gradient(135deg, var(--yellow-7), var(--yellow-10))' },
      },
      reactions: 188,
      comments: 12,
    },
    {
      author: 'Daniel Amrani',
      role: 'Head of Brand at Pylon · 1st',
      time: '1d',
      avatar: 'DA',
      variant: 'g6',
      photoSeed: 'Daniel Amrani',
      body: 'Hot take: most "design systems" are asset libraries with a sitemap. A real system teaches you how to decide — what to build, what to reuse, what to leave alone. The docs are doing the heavy lifting; the tokens are just evidence.',
      reactions: 1204,
      comments: 96,
    },
  ];
  return (
    <main className="stack">
      <Composer />
      {posts.map((p, i) => (
        <React.Fragment key={i}>
          <Post {...p} liked={!!likes[i]} onLike={() => toggleLike(i)} />
          {i === 0 && <FeedAd ad={AD_LIBRARY.notion} />}
          {i === 1 && <FeedAd ad={AD_LIBRARY.figma} />}
        </React.Fragment>
      ))}
    </main>
  );
}

Object.assign(window, { Composer, Post, Feed });
