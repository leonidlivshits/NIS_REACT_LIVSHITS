import React, { useState } from 'react'
import {
  Box,
  Button,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Divider,
} from '@mui/material'
import {
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material'
import { axiosClient } from '../../../../api/axiosClient'
import { styled } from '@mui/material/styles'

const DemoCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
  boxShadow: '5px 5px 15px #d9d9d9, -5px -5px 15px #ffffff',
}))

const UserAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  width: 40,
  height: 40,
}))

interface UserData {
  id: number
  name: string
  email: string
  username: string
}

const CancelRequestDemo: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const [requestTime, setRequestTime] = useState<number | null>(null)

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)
    setCancelled(false)
    setUsers([])
    setRequestTime(Date.now())

    try {
      const data = await axiosClient.get<UserData[]>('/users?_limit=5')
      setUsers(data)
      setSuccess(true)
    } catch (err: any) {
      if (err.message === 'Запрос отменен пользователем') {
        setError('Запрос был отменен пользователем')
        setCancelled(true)
      } else {
        setError(`Ошибка: ${err.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    axiosClient.cancelRequest()
  }

  const formatTime = (ms: number | null) => {
    if (!ms) return '0ms'
    return `${ms}ms`
  }

  return (
    <DemoCard elevation={0}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Демонстрация отмены запроса с Axios
      </Typography>

      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        gap: 3 
      }}>
        <Box sx={{ flex: 2 }}>
          <Box mb={3}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Нажмите "Запустить запрос", чтобы начать загрузку данных. Нажмите "Отменить запрос",
              чтобы прервать выполнение. Обратите внимание на консоль для просмотра логов.
            </Typography>
          </Box>

          <Box display="flex" gap={2} mb={3} flexWrap="wrap">
            <Button
              variant="contained"
              onClick={fetchUsers}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <PlayArrowIcon />}
              sx={{
                background: 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #009688 0%, #8bc34a 100%)',
                },
              }}
            >
              {loading ? 'Загрузка...' : 'Запустить запрос'}
            </Button>

            {loading && (
              <Button
                variant="contained"
                color="error"
                onClick={handleCancel}
                startIcon={<StopIcon />}
              >
                Отменить запрос
              </Button>
            )}

            <Button
              variant="outlined"
              onClick={() => {
                setUsers([])
                setError(null)
                setSuccess(false)
                setCancelled(false)
              }}
            >
              Сбросить
            </Button>
          </Box>

          {loading && (
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <CircularProgress size={24} />
              <Typography variant="body2">
                Идет загрузка данных... 
              </Typography>
            </Box>
          )}

          {success && (
            <Alert
              severity="success"
              icon={<CheckCircleIcon />}
              sx={{ mb: 3 }}
              action={
                <IconButton
                  size="small"
                  onClick={() => setSuccess(false)}
                >
                  <CancelIcon fontSize="small" />
                </IconButton>
              }
            >
              <Box>
                Запрос успешно выполнен! Загружено {users.length} пользователей.
                {requestTime && (
                  <Typography variant="caption" component="div" sx={{ mt: 1 }}>
                    Время выполнения: {formatTime(Date.now() - requestTime)}
                  </Typography>
                )}
              </Box>
            </Alert>
          )}

          {cancelled && (
            <Alert
              severity="warning"
              icon={<CancelIcon />}
              sx={{ mb: 3 }}
            >
              Запрос был отменен пользователем
            </Alert>
          )}

          {error && !cancelled && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
        </Box>

        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              p: 2,
              backgroundColor: 'grey.50',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'grey.200',
            }}
          >
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
              Статус запроса:
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Chip
                label={loading ? 'В процессе' : 'Не активен'}
                color={loading ? 'warning' : 'default'}
                size="small"
                variant="outlined"
              />
              <Chip
                label={success ? 'Успешно' : 'Не завершен'}
                color={success ? 'success' : 'default'}
                size="small"
                variant="outlined"
              />
              <Chip
                label={cancelled ? 'Отменен' : 'Не отменен'}
                color={cancelled ? 'error' : 'default'}
                size="small"
                variant="outlined"
              />
            </Box>
            {requestTime && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                Последний запрос: {new Date(requestTime).toLocaleTimeString()}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {users.length > 0 && (
        <Box mt={3}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            Загруженные пользователи:
          </Typography>
          <List sx={{ maxHeight: 300, overflow: 'auto' }}>
            {users.map((user, index) => (
              <React.Fragment key={user.id}>
                <ListItem sx={{ py: 2, px: 0 }}>
                  <ListItemAvatar>
                    <UserAvatar>
                      <PersonIcon />
                    </UserAvatar>
                  </ListItemAvatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" fontWeight={500}>
                      {user.name}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', mt: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        @{user.username}
                      </Typography>
                      <Typography variant="body2" color="primary">
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={`ID: ${user.id}`}
                    size="small"
                    variant="outlined"
                  />
                </ListItem>
                {index < users.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Box>
      )}

      <Box mt={3} pt={2} borderTop={1} borderColor="divider">
        <Typography variant="caption" color="text.secondary">
          Axios Interceptor добавляет заголовок Authorization и обрабатывает отмену через AbortController.
        </Typography>
      </Box>
    </DemoCard>
  )
}

export default CancelRequestDemo