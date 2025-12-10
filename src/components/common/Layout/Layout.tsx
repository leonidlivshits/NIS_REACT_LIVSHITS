import React from 'react'
import { Outlet } from 'react-router-dom'
import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  Toolbar,
  Typography,
  Button,
} from '@mui/material'
import { Home, People } from '@mui/icons-material'
import { Link, useLocation } from 'react-router-dom'
import { styled } from '@mui/material/styles'

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}))

const StyledButton = styled(Button)(({ theme }) => ({
  color: 'white',
  marginLeft: theme.spacing(2),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}))

const ContentContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  minHeight: 'calc(100vh - 64px)',
}))

const Layout: React.FC = () => {
  const location = useLocation()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <StyledAppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            User Management
          </Typography>
          <Box>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <StyledButton
                startIcon={<Home />}
                variant={location.pathname === '/' ? 'outlined' : 'text'}
              >
                Главная
              </StyledButton>
            </Link>
            <Link to="/users" style={{ textDecoration: 'none' }}>
              <StyledButton
                startIcon={<People />}
                variant={location.pathname === '/users' ? 'outlined' : 'text'}
              >
                Пользователи
              </StyledButton>
            </Link>
          </Box>
        </Toolbar>
      </StyledAppBar>
      <ContentContainer maxWidth="lg">
        <Outlet />
      </ContentContainer>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) => theme.palette.grey[100],
          borderTop: (theme) => `1px solid ${theme.palette.grey[300]}`,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Демонстрация RTK Query + Axios
        </Typography>
      </Box>
    </Box>
  )
}

export default Layout