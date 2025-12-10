import React, { useState } from 'react'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Typography,
  Chip,
  Button,
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material'
import { useGetUsersQuery, useDeleteUserMutation } from '../../api/usersApi'
import { User } from '../../../types/user.types'
import { styled } from '@mui/material/styles'

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}))

interface UserListProps {
  onEditUser: (user: User) => void
  onError?: (message: string) => void
}

const UserList: React.FC<UserListProps> = ({ onEditUser, onError }) => {
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null)
  
  const { 
    data: users, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useGetUsersQuery()
  
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Вы уверены, что хотите удалить пользователя "${name}"?`)) {
      setDeleteUserId(id)
      try {
        await deleteUser(id).unwrap()
        onError?.('Пользователь успешно удален')
        setTimeout(() => refetch(), 300)
      } catch (err) {
        console.error('Ошибка при удалении пользователя:', err)
        onError?.('Не удалось удалить пользователя')
      } finally {
        setDeleteUserId(null)
      }
    }
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    )
  }

  if (isError) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={() => refetch()}>
            Повторить
          </Button>
        }
      >
        Не удалось загрузить пользователей. Ошибка: {error?.toString() || 'Неизвестная ошибка'}
      </Alert>
    )
  }

  if (!users || users.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <PersonIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Пользователи не найдены
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Добавьте первого пользователя, используя кнопку "Добавить пользователя"
        </Typography>
      </Box>
    )
  }

  return (
    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
      <Table sx={{ minWidth: 650 }} size="medium">
        <TableHead>
          <TableRow sx={{ backgroundColor: 'primary.light' }}>
            <TableCell sx={{ color: 'white', fontWeight: 600 }}>ID</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Имя</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Email</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Телефон</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Город</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Компания</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 600, textAlign: 'center' }}>
              Действия
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <StyledTableRow key={user.id}>
              <TableCell>
                <Chip
                  label={`#${user.id}`}
                  size="small"
                  sx={{ backgroundColor: '#e3f2fd', fontWeight: 500 }}
                />
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  <PersonIcon fontSize="small" color="primary" />
                  <Typography fontWeight={500}>{user.name}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  @{user.username}
                </Typography>
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  <EmailIcon fontSize="small" color="primary" />
                  <Typography>{user.email}</Typography>
                </Box>
              </TableCell>
              <TableCell>{user.phone || 'Не указан'}</TableCell>
              <TableCell>
                <Chip
                  label={user.address.city}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2">{user.company.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.company.catchPhrase}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Box display="flex" gap={1} justifyContent="center">
                  <Tooltip title="Редактировать">
                    <IconButton
                      size="small"
                      onClick={() => onEditUser(user)}
                      sx={{
                        color: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'primary.light',
                          color: 'white',
                        },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Удалить">
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(user.id, user.name)}
                      disabled={isDeleting && deleteUserId === user.id}
                      sx={{
                        color: 'error.main',
                        '&:hover': {
                          backgroundColor: 'error.light',
                          color: 'white',
                        },
                      }}
                    >
                      {isDeleting && deleteUserId === user.id ? (
                        <CircularProgress size={20} />
                      ) : (
                        <DeleteIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color="text.secondary">
          Всего пользователей: {users.length}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={() => refetch()}
          startIcon={<RefreshIcon />}
        >
          Обновить список
        </Button>
      </Box>
    </TableContainer>
  )
}

export default UserList