import React, { useState } from 'react';
import Post from '../../components/Post';
import { seededPhoto } from '../../components/Avatar';

export default {
  title: 'Patterns/Post',
  component: Post,
  parameters: {
    layout: 'padded',
  },
};

const basePost = {
  author: 'Sofia Antonova',
  role: 'Staff Designer at Helix · 2nd',
  time: '2h',
  avatar: 'SA',
  variant: 'g4',
  photoSeed: 'Sofia Antonova',
  body: 'Shipping a refresh of our component library today. Fewer tokens, warmer neutrals, and — finally — a proper focus ring on every interactive surface.',
  reactions: 482,
  comments: 34,
};

function InteractivePost(props) {
  const [liked, setLiked] = useState(props.liked || false);
  return <Post {...props} liked={liked} onLike={() => setLiked(l => !l)} />;
}

export const Default = {
  render: () => <InteractivePost {...basePost} />,
};

export const Liked = {
  name: 'Liked State',
  render: () => <InteractivePost {...basePost} liked={true} />,
};

export const WithAttachment = {
  name: 'With Attachment',
  render: () => (
    <InteractivePost
      {...basePost}
      attachment={{
        title: 'Radix Colors for design systems that age well',
        sub: 'davinci-systems.com · 8 min read',
        image: seededPhoto('article-radix-colors', 480, 240, 'article'),
      }}
    />
  ),
};

export const CompanyPost = {
  name: 'Company Post',
  render: () => (
    <InteractivePost
      author="Helix Systems"
      role="Product & Design Platform · 24,802 followers"
      time="5h"
      avatar="HX"
      variant="g2"
      isCompany={true}
      body="We're hiring a Design Engineer to work on our token pipeline. Based in Lisbon or fully remote."
      attachment={{
        title: 'Design Engineer · Helix Platform Team',
        sub: 'Remote / Lisbon · 5 days ago · 48 applicants',
        style: { background: 'linear-gradient(135deg, var(--yellow-7), var(--yellow-10))' },
      }}
      reactions={188}
      comments={12}
    />
  ),
};
