# Image Component

```md
![Logo](../../public/img.jpeg)
```

with Nextra, is equivalent to

```jsx
import Image from 'next/image'
import img from '../../public/img.jpeg'

<Image src={img} alt="Logo" placeholder='blur'>
```

Example:

<br/>

![Powered by Next.js Image](../../public/img.jpeg)
