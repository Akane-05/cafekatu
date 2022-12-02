// import { NextPage } from 'next'
// import Router from 'next/router'
import {
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  FormControl,
  InputAdornment,
  InputLabel,
  IconButton,
  OutlinedInput,
  Hidden,
  FormHelperText,
  Link,
  Input,
} from '@mui/material'
import React, { useState, useRef } from 'react'
import Review from '@/components/elements/ReviewCard'
import CustomPaper, { LinkPaper } from '@/components/layouts/CustomPaper'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { path, strage, requests } from '@/const/Consts'
import { useRouter } from 'next/router'
import { useUserInfo } from '@/hooks/useUserInfo'
import * as yup from 'yup'
import { validate } from '@/lib/validate'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/styles/theme'

type State = {
  nickname?: string
  email?: string
  password: string
  newPassword: string
  newPasswordConfirm: string
}

export default function Mypage() {
  const router = useRouter()
  const { userInfo } = useUserInfo()

  const [values, setValues] = React.useState<State>({
    nickname: userInfo?.nickname,
    email: userInfo?.email,
    password: '',
    newPassword: '',
    newPasswordConfirm: '',
  })

  const [isEdit, setIsEdit] = React.useState<boolean>(false)
  const [showPassword, setShowPassword] = React.useState<boolean>(false)

  const [errors, setErrors] = React.useState<any>({})

  // バリデーションルール
  const scheme = yup.object({
    nickname: yup
      .string()
      .matches(/^.{2,20}$/, '半角英数字8桁で入力してください。'),
    email: yup.string().email('正しいメールアドレスを入力してください。'),
    password: yup
      .string()
      .required('必須項目です')
      .matches(/^([a-zA-Z0-9]{8})$/, '半角英数字8桁で入力してください。'),
    newPassword: yup
      .string()
      .matches(
        /^([a-zA-Z0-9]{8,20})$/,
        '半角英数字8文字以上20文字以下で入力してください。',
      ),
    newPasswordConfirm: yup
      .string()
      .matches(
        /^([a-zA-Z0-9]{8,20})$/,
        '半角英数字8文字以上20文字以下で入力してください。',
      )
      .oneOf(
        [yup.ref('newPassword'), null],
        '確認用パスワードが一致していません',
      ),
  })

  const handleLink = (path: string) => {
    router.push(path)
  }

  const handleWithdrawal = () => {}

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
  }

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value })
    }

  const update = () => {
    const errors = validate({ ...values }, scheme)
    setErrors(errors)
    let error = false
    for (const key of Object.keys(errors)) {
      if (errors[key]) {
        error = true
      }
    }

    console.log(error)
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <LinkPaper elevation={0}>
          <Link
            onClick={() => handleLink(path.cafesList)}
            component="button"
            variant="body1"
          >
            店舗一覧に戻る
          </Link>
        </LinkPaper>

        <CustomPaper>
          <Paper sx={{ p: 2, m: 1 }}>
            {!isEdit ? (
              <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
              >
                <Grid item xs={12}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    color="secondary"
                    sx={{ ml: 1 }}
                  >
                    ユーザー情報
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6} sx={{ p: 1 }}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    variant="standard"
                    id="nickName"
                    label="nickName"
                    //defaultValue="ニックネーム"
                    value={userInfo?.nickname}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>

                <Grid item xs={0} md={6}></Grid>

                <Grid item xs={12} md={6} sx={{ p: 1 }}>
                  <TextField
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    variant="standard"
                    id="email"
                    label="email"
                    //defaultValue="email"
                    value={userInfo?.email}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>

                <Grid item xs={0} md={6}></Grid>

                <Grid
                  container
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                  sx={{ mt: 1 }}
                >
                  <Button
                    variant="contained"
                    onClick={() => setIsEdit(true)}
                    sx={{ mr: 1 }}
                  >
                    編集
                  </Button>
                </Grid>
              </Grid>
            ) : (
              <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
              >
                <Grid item xs={12} md={6} sx={{ p: 1 }}>
                  <TextField
                    fullWidth
                    variant="standard"
                    id="nickName"
                    label="nickName"
                    defaultValue={userInfo?.nickname}
                    error={!!errors.nickname}
                    helperText={errors.nickname?.message}
                    //value={userInfo?.nickname}
                  />
                </Grid>
                <Grid item xs={0} md={6}></Grid>

                <Grid item xs={12} md={6} sx={{ p: 1 }}>
                  <TextField
                    fullWidth
                    variant="standard"
                    id="email"
                    label="email"
                    defaultValue={userInfo?.email}
                    error={!!errors.email}
                    helperText={errors.email?.message}

                    //value={userInfo?.nickname}
                  />
                </Grid>
                <Grid item xs={0} md={6}></Grid>

                <Grid item xs={12} md={6} sx={{ p: 1 }}>
                  <InputLabel htmlFor="password" shrink={true}>
                    現在のPassword
                  </InputLabel>
                  <Input
                    fullWidth
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    onChange={handleChange('password')}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    required={true}
                    error={!!errors.password}
                  />
                  <FormHelperText error id="password-error">
                    {errors.password?.message}
                  </FormHelperText>
                </Grid>
                <Grid item xs={0} md={6}></Grid>

                <Grid item xs={12} md={6} sx={{ p: 1 }}>
                  <InputLabel htmlFor="newPassword" shrink={true}>
                    新しいPassword
                  </InputLabel>
                  <Input
                    fullWidth
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={values.newPassword}
                    onChange={handleChange('newPassword')}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle newPassword visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    error={!!errors.newPassword}
                  />
                  <FormHelperText error id="newPassword-error">
                    {errors.newPassword?.message}
                  </FormHelperText>
                </Grid>

                <Grid item xs={0} md={6}></Grid>

                <Grid item xs={12} md={6} sx={{ p: 1 }}>
                  <InputLabel htmlFor="newPasswordConfirm" shrink={true}>
                    Password確認
                  </InputLabel>
                  <Input
                    fullWidth
                    id="newPasswordConfirm"
                    type={showPassword ? 'text' : 'password'}
                    value={values.newPasswordConfirm}
                    onChange={handleChange('newPasswordConfirm')}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle newPasswordConfirm visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    required={values.newPassword != '' ? true : false}
                    error={!!errors.newPasswordConfirm}
                  />
                  <FormHelperText error id="newPasswordConfirm-error">
                    {errors.newPasswordConfirm?.message}
                  </FormHelperText>
                </Grid>

                <Grid item xs={0} md={6}></Grid>

                <Grid
                  container
                  direction="row"
                  justifyContent="space-around"
                  alignItems="center"
                  spacing={1}
                  sx={{ mt: 2, ml: 2 }}
                >
                  <Grid item xs={12} sm={2}>
                    <Button
                      variant="contained"
                      onClick={() => setIsEdit(false)}
                      sx={{ mr: 2 }}
                    >
                      戻る
                    </Button>
                  </Grid>

                  <Grid item xs={0} sm={7}>
                    <Hidden></Hidden>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <Button variant="contained" onClick={update} sx={{ mr: 2 }}>
                      変更
                    </Button>
                    <Button onClick={() => handleLink(path.withdrawal)}>
                      退会
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            )}
            {/* </Paper> */}
          </Paper>
        </CustomPaper>
      </ThemeProvider>

      {/* <CustomPaper sx={{ mt: 2 }}>
        <Typography variant="h5" gutterBottom color="primary">
          過去の口コミ
        </Typography>

        {response.response.data.reviews?.map((review: Review) => {
          return <ReviewCard key={review.id} review={review} /> //keyを指定
        })}
      </CustomPaper> */}
    </>
  )
}
