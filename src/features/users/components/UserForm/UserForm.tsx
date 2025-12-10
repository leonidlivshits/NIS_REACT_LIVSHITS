import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  CircularProgress,
} from '@mui/material'
import { Close as CloseIcon, Save as SaveIcon } from '@mui/icons-material'
import { User, CreateUserDto } from '../../../types/user.types'

interface UserFormProps {
  user: User | null
  open: boolean
  onClose: () => void
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

const UserForm: React.FC<UserFormProps> = ({
  user,
  open,
  onClose,
  onSuccess,
  onError,
}) => {
  const isEditMode = !!user
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    website: '',
    street: '',
    city: '',
    zipcode: '',
    companyName: '',
    catchPhrase: '',
    bs: '',
  })
  
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        website: user.website || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        zipcode: user.address?.zipcode || '',
        companyName: user.company?.name || '',
        catchPhrase: user.company?.catchPhrase || '',
        bs: user.company?.bs || '',
      })
    } else {
      setFormData({
        name: '',
        username: '',
        email: '',
        phone: '',
        website: '',
        street: '',
        city: '',
        zipcode: '',
        companyName: '',
        catchPhrase: '',
        bs: '',
      })
    }
    setErrors({})
  }, [user])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) newErrors.name = 'Имя обязательно'
    if (!formData.username.trim()) newErrors.username = 'Имя пользователя обязательно'
    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Некорректный email'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      onError('Пожалуйста, заполните обязательные поля корректно')
      return
    }
    
    setLoading(true)
    
    try {
      const userData: CreateUserDto = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        phone: formData.phone || undefined,
        website: formData.website || undefined,
        address: {
          street: formData.street || '',
          city: formData.city || '',
          zipcode: formData.zipcode || '',
          geo: { lat: '0', lng: '0' },
          suite: '',
        },
        company: {
          name: formData.companyName || '',
          catchPhrase: formData.catchPhrase || '',
          bs: formData.bs || '',
        },
      }

      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Отправка данных:', userData)
      
      if (isEditMode && user) {
        onSuccess(`Пользователь "${formData.name}" успешно обновлен!`)
      } else {
        onSuccess(`Пользователь "${formData.name}" успешно создан!`)
      }
      
      onClose()
      
    } catch (error) {
      console.error('Ошибка при сохранении пользователя:', error)
      onError(
        isEditMode
          ? 'Не удалось обновить пользователя'
          : 'Не удалось создать пользователя'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="div">
            {isEditMode ? 'Редактирование пользователя' : 'Создание нового пользователя'}
          </Typography>
          <IconButton onClick={onClose} disabled={loading}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 3 
          }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main' }}>
                Основная информация
              </Typography>
              
              <TextField
                name="name"
                label="Полное имя *"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!errors.name}
                helperText={errors.name}
                disabled={loading}
              />

              <TextField
                name="username"
                label="Имя пользователя *"
                value={formData.username}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!errors.username}
                helperText={errors.username}
                disabled={loading}
              />

              <TextField
                name="email"
                label="Email *"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                type="email"
                error={!!errors.email}
                helperText={errors.email}
                disabled={loading}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main' }}>
                Контактная информация
              </Typography>

              <TextField
                name="phone"
                label="Телефон"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled={loading}
              />

              <TextField
                name="website"
                label="Веб-сайт"
                value={formData.website}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled={loading}
              />
            </Box>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 3, 
            mt: 3 
          }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main' }}>
                Адрес
              </Typography>

              <TextField
                name="street"
                label="Улица"
                value={formData.street}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled={loading}
              />

              <TextField
                name="city"
                label="Город"
                value={formData.city}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled={loading}
              />

              <TextField
                name="zipcode"
                label="Почтовый индекс"
                value={formData.zipcode}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled={loading}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main' }}>
                Компания
              </Typography>

              <TextField
                name="companyName"
                label="Название компании"
                value={formData.companyName}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled={loading}
              />

              <TextField
                name="catchPhrase"
                label="Слоган"
                value={formData.catchPhrase}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled={loading}
                multiline
                rows={2}
              />

              <TextField
                name="bs"
                label="Деятельность"
                value={formData.bs}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled={loading}
                multiline
                rows={2}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Отмена
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
              },
            }}
          >
            {isEditMode ? 'Обновить' : 'Создать'}
            {loading && '...'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default UserForm