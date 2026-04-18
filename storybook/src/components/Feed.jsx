import React, { useState } from 'react';
import Composer from './Composer';
import Post from './Post';
import { seededPhoto } from './Avatar';

function Feed() {
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
      body: "We're hiring a Design Engineer to work on our token pipeline. Based in Lisbon or fully remote.\n\nApply or refer someone great — this person will define the next chapter of our design platform.",
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
        <Post key={i} {...p} liked={!!likes[i]} onLike={() => toggleLike(i)} />
      ))}
    </main>
  );
}

export default Feed;
