import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Paper,
} from '@mui/material'
import { Link } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import {
  CheckCircle,
  Api,
  Cancel,
  AddCircle,
  Edit,
  Delete,
  People as PeopleIcon,
} from '@mui/icons-material'

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}))

const HomePage: React.FC = () => {
  const features = [
    {
      title: 'Просмотр пользователей',
      description: 'Получение списка пользователей через RTK Query',
      icon: <Api />,
      color: '#1976d2',
    },
    {
      title: 'Добавление пользователей',
      description: 'Форма создания новых пользователей',
      icon: <AddCircle />,
      color: '#2e7d32',
    },
    {
      title: 'Редактирование пользователей',
      description: 'Обновление информации о пользователях',
      icon: <Edit />,
      color: '#ed6c02',
    },
    {
      title: 'Отмена запросов',
      description: 'Демонстрация отмены запросов через AbortController',
      icon: <Cancel />,
      color: '#d32f2f',
    },
    {
      title: 'Axios Interceptors',
      description: 'Настройка перехватчиков запросов и ответов',
      icon: <CheckCircle />,
      color: '#7b1fa2',
    },
  ]

  const technologies = [
    'React 18',
    'TypeScript',
    'Redux Toolkit',
    'RTK Query',
    'Material UI',
    'Axios',
    'React Router',
  ]

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 6,
          mb: 6,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Управление пользователями
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
          Приложение с использованием RTK Query, Axios и Material UI
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          {technologies.map((tech) => (
            <Chip
              key={tech}
              label={tech}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 500,
              }}
            />
          ))}
        </Box>
      </Paper>

      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Link to="/users" style={{ textDecoration: 'none' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<PeopleIcon />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
              },
            }}
          >
            Перейти к управлению пользователями
          </Button>
        </Link>
      </Box>

      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
        Возможности приложения
      </Typography>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: 4 
      }}>
        {features.map((feature, index) => (
          <StyledCard key={index}>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '12px',
                    backgroundColor: `${feature.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                  }}
                >
                  <Box sx={{ color: feature.color, fontSize: 28 }}>
                    {feature.icon}
                  </Box>
                </Box>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                  {feature.title}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </CardContent>
          </StyledCard>
        ))}
      </Box>
    </Box>
  )
}

export default HomePage