import React from 'react'
import { Box, Typography, Button, Container } from '@mui/material'
import { Home as HomeIcon, ArrowBack } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { styled } from '@mui/material/styles'

const StyledContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '70vh',
  textAlign: 'center',
}))

const NotFound: React.FC = () => {
  return (
    <StyledContainer maxWidth="md">
      <Typography
        variant="h1"
        component="h1"
        sx={{
          fontSize: { xs: '6rem', sm: '8rem', md: '10rem' },
          fontWeight: 900,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 2,
        }}
      >
        404
      </Typography>
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
        Страница не найдена
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 4, maxWidth: 600 }}
      >
        К сожалению, страница, которую вы ищете, не существует или была
        перемещена. Проверьте URL или вернитесь на главную страницу.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<HomeIcon />}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
              },
            }}
          >
            На главную
          </Button>
        </Link>
        <Button
          variant="outlined"
          size="large"
          startIcon={<ArrowBack />}
          onClick={() => window.history.back()}
          sx={{
            borderColor: '#667eea',
            color: '#667eea',
            '&:hover': {
              borderColor: '#5a67d8',
              backgroundColor: 'rgba(102, 126, 234, 0.04)',
            },
          }}
        >
          Назад
        </Button>
      </Box>
    </StyledContainer>
  )
}

export default NotFound