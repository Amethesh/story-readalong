import React from 'react';
import HTMLFlipBook from 'react-pageflip';

const poems = [
  {
    "poem": "A little sugar ant goes on a big scary adventure in the big, wide world... until he decides to come back home.",
    "image": "/images/Kids-poems-Ant-Explorer-short-stories-for-kids-header-978x652.jpg"
  },
  {
    "poem": "Once a little sugar ant made up his mind to roam-  To fare away, far away, far away from home.",
    "image": "/images/Kids-poems-Ant-Explorer-short-stories-for-kids-desert.jpg"
  },
  {
    "poem": "He had eaten all his breakfast, and he had his ma’s consent  To see what he should chance to see and here’s the way he went",
    "image": "/images/Kids-poems-Ant-Explorer-fern-and-rocks-short-stories-for-kids.jpg"
  },
  {
    "poem": "Up and down a fern frond, round and round a stone, Down a gloomy gully where he loathed to be alone,",
    "image": "/images/Kids-poems-Ant-Explorer-fern-and-rocks-short-stories-for-kids.jpg"
  },
  {
    "poem": "Up a mighty mountain range, seven inches high, Through the fearful forest grass that nearly hid the sky,",
    "image": "/images/Kids-poems-Ant-Explorer-short-stories-for-kids-desert.jpg"
  },
];

function Test() {
  const alternateElements = [];
  for (let i = 0; i < poems.length; i++) {
    const item = poems[i];
    alternateElements.push(
      <img key={`img${i}`} src={item.image} alt="poem" style={{ maxWidth: '200px', marginRight: '20px' }} />,
      <p key={`poem${i}`}>{item.poem}</p>
    );
  }

  return (
    <HTMLFlipBook width={300} height={200}>
      {alternateElements}
    </HTMLFlipBook>
  );
}

export default Test;
