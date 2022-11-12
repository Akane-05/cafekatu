// import { NextPage } from 'next'
// import Router from 'next/router'
import {
  Grid,
  TextField,
  Button,
  Paper,
  Card,
  CardMedia,
  CardContent,
  Box,
  Typography,
  CardActions,
  Hidden,
  IconButton,
} from '@mui/material'
import React, { useState } from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { Cafe, CafeInfo } from '@/features/cafes/types'

import { useRouter } from 'next/router'

type Props = {
  cafeInfo: CafeInfo
}

type State = {
  isFavorite: boolean
}

export default function CafeCard(props: Props) {
  const router = useRouter() //useRouterフックを定義して

  const [values, setValues] = React.useState<State>({
    isFavorite: false,
  })

  const [cafeInfo] = useState(props.cafeInfo)

  const handleClickFavorite = () => {
    setValues({
      ...values,
      isFavorite: !values.isFavorite,
    })
  }

  const handleDetailsPage = (path: string) => {
    router.push({
      pathname: path,
      query: { id: cafeInfo.id },
    })
  }

  const handleMouseDownFavorite = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
  }

  return (
    <Card sx={{ mt: 1, mb: 1 }}>
      <Grid container>
        <Grid item xs={12} sm={3}>
          <CardMedia
            component="img"
            // sx={{ width: 151 }}
            image="/cake.jpg"
            alt="写真の説明"
            sx={{ width: '100%', height: '100%' }}
          />
        </Grid>

        <Grid item xs={12} sm={9}>
          <CardContent>
            <Grid
              container
              direction="row-reverse"
              justifyContent="flex-end"
              alignItems="center"
            >
              <Grid item xs={12} sm={1}>
                <Grid
                  container
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <IconButton
                    aria-label="favorite"
                    onClick={handleClickFavorite}
                    onMouseDown={handleMouseDownFavorite}
                    edge="end"
                    sx={{ mr: 1 }}
                  >
                    {values.isFavorite ? (
                      <FavoriteIcon color="primary" />
                    ) : (
                      <FavoriteBorderIcon color="primary" />
                    )}
                  </IconButton>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={11}>
                <Typography component="div" variant="h5" sx={{ mb: 1 }}>
                  {cafeInfo.name}
                </Typography>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={6} sm={3}>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  sx={{ mr: 3 }}
                >
                  ☆☆☆
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  sx={{ mr: 3 }}
                >
                  {cafeInfo.rating}
                </Typography>
              </Grid>
              <Grid item xs={0} sm={6}>
                <Hidden></Hidden>
              </Grid>
            </Grid>

            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
            >
              {cafeInfo.prefecture_id}
              {cafeInfo.city}
              {cafeInfo.street}
            </Typography>

            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="flex-end"
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleDetailsPage('./CafeDetail')}
              >
                詳細
              </Button>
            </Grid>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  )
}
