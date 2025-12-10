import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Alert,
  Snackbar,
} from '@mui/material'
import { Add } from '@mui/icons-material'
import UserList from '../../features/users/components/UserList/UserList'
import UserForm from '../../features/users/components/UserForm/UserForm'
import CancelRequestDemo from '../../features/users/components/CancelRequestDemo/CancelRequestDemo'
import { User } from '../../features/types/user.types'
import { useGetUsersQuery } from '../../features/users/api/usersApi'
import { styled } from '@mui/material/styles'

const PageHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  flexWrap: 'wrap',
  gap: theme.spacing(2),
}))

const Section = styled(Box)(({ theme }) => ({
  backgroundColor: 'white',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  boxShadow: theme.shadows[1],
}))

const UsersPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  })

  const { refetch } = useGetUsersQuery()

  const handleAddUser = () => {
    setEditingUser(null)
    setIsFormOpen(true)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingUser(null)
  }

  const handleSuccess = (message: string) => {
    setSnackbar({
      open: true,
      message,
      severity: 'success',
    })
    refetch()
    handleCloseForm()
  }

  const handleError = (message: string) => {
    setSnackbar({
      open: true,
      message,
      severity: 'error',
    })
  }

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }))
  }

  return (
    <Box>
      <PageHeader>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Управление пользователями
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Создавайте, редактируйте и управляйте пользователями системы
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddUser}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
            },
          }}
        >
          Добавить пользователя
        </Button>
      </PageHeader>

      <Section>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Список пользователей
        </Typography>
        <UserList onEditUser={handleEditUser} onError={handleError} />
      </Section>

      <Section>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Демонстрация отмены запроса
        </Typography>
        <CancelRequestDemo />
      </Section>

      <UserForm
        user={editingUser}
        open={isFormOpen}
        onClose={handleCloseForm}
        onSuccess={handleSuccess}
        onError={handleError}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default UsersPage