import Head from 'next/head'
import dynamic from 'next/dynamic'
import NavBar from '../navbar'
import { Box, Container } from '@chakra-ui/react'
import Footer from '../footer'
import VoxelDogLoader from '../voxel-dog-loader'

const LazyVoxelDog = dynamic(() => import('../voxel-dog'), {
  ssr: false,
  loading: () => <VoxelDogLoader />
})

const Main = ({ children, router }) => {
  return (
    <Box as="main" pb={8}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Nayan's homepage" />
        <meta name="author" content="Nayan Dey" />
        <meta name="author" content="nayan-dey" />
        <link rel="apple-touch-icon" href="apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <meta name="twitter:title" content="Nayan Dey" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@NayanJpg" />
        <meta name="twitter:creator" content="@NayanJpg" />
        <meta name="twitter:image" content="nayan-dey" />
        <meta property="og:site_name" content="Nayan Dey" />
        <meta name="og:title" content="Nayan Dey" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="nayan-dey" />
        <title>Nayan Dey - Homepage</title>
      </Head>

      <NavBar path={router.asPath} />

      <Container maxW="container.md" pt={14}>
        {children}

        <Footer />
      </Container>
    </Box>
  )
}

export default Main
