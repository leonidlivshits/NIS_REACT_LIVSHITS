import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Container,
  Typography,
  Skeleton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Box,
  Chip,
  Paper,
  SelectChangeEvent,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { History, Refresh } from '@mui/icons-material';
import { PetCard } from '../components/PetCard/PetCard';
import { useEventLog } from '../hooks/useEventLog';
import { EventLog } from '../components/EventLog/EventLog';
import { Pet } from '../components/PetCard/types';
import petsData from '../data/pets.json';

export const Dashboard: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [speciesFilter, setSpeciesFilter] = useState<string>('all');
  const [eventLogOpen, setEventLogOpen] = useState(false);
  const { addEvent } = useEventLog();

  const mergePets = (savedPets: Pet[], jsonPets: Pet[]): Pet[] => {
    const savedMap = new Map(savedPets.map(pet => [pet.id, pet]));
    return jsonPets.map(jsonPet => {
      const savedPet = savedMap.get(jsonPet.id);
      if (savedPet) {
        return {
          ...jsonPet,
          energy: savedPet.energy,
          mood: savedPet.mood,
          level: savedPet.level,
        };
      }
      return jsonPet;
    });
  };

  useEffect(() => {
    const loadPets = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        const savedPetsRaw = localStorage.getItem('pets');
        if (savedPetsRaw) {
          const savedPets = JSON.parse(savedPetsRaw) as Pet[];
          const jsonPets = petsData as Pet[];
          const merged = mergePets(savedPets, jsonPets);
          setPets(merged);
          addEvent('Загрузка из сохранённых данных');
        } else {
          setPets(petsData as Pet[]);
          addEvent('Первоначальная загрузка данных');
        }
      } catch (err) {
        console.error('Ошибка загрузки:', err);
        setPets(petsData as Pet[]);
        addEvent('Загрузка из резервного источника');
      } finally {
        setLoading(false);
      }
    };

    loadPets();
  }, [addEvent]);

  useEffect(() => {
    if (!loading && pets.length > 0) {
      try {
        localStorage.setItem('pets', JSON.stringify(pets));
      } catch (err) {
        console.error('Ошибка сохранения:', err);
        addEvent('Ошибка сохранения данных');
      }
    }
  }, [pets, loading, addEvent]);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      const jsonPets = petsData as Pet[];
      const merged = mergePets(pets, jsonPets);
      setPets(merged);
      setLoading(false);
      addEvent('Данные синхронизированы с исходными');
    }, 1000);
  };

  const filteredPets = useMemo(() => {
    if (speciesFilter === 'all') return pets;
    return pets.filter(pet => pet.species.toLowerCase().includes(speciesFilter.toLowerCase()));
  }, [pets, speciesFilter]);

  const speciesOptions = useMemo(() => {
    const species = [...new Set(pets.map(pet => pet.species))];
    return ['all', ...species];
  }, [pets]);

  const handleUpdatePet = useCallback((id: string, updates: Partial<Pet>) => {
    setPets(prev => prev.map(pet => (pet.id === id ? { ...pet, ...updates } : pet)));
    addEvent(`Обновлён питомец ${id}`);
  }, []);

  
  const onFilterChange = (e: SelectChangeEvent<string>) => {
    setSpeciesFilter(e.target.value as string);
    addEvent(`Фильтр изменён: ${e.target.value}`);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper
        sx={{
          p: 3,
          mb: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          overflow: 'hidden',
          minHeight: { xs: 160, sm: 'auto' },
        }}
      >
        <div className="container" style={{ height: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'flex-start', md: 'center' },
              gap: 2,
              height: '100%',
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h3" component="h1" color="white" fontWeight="700" sx={{ lineHeight: 1.05 }}>
                Кибер-Зоопарк 2077
              </Typography>
              <Typography variant="h6" color="white" sx={{ opacity: 0.9 }}>
                Управление цифровыми питомцами будущего
              </Typography>
              <Typography variant="caption" color="white" sx={{ opacity: 0.7, display: 'block', mt: 1 }}>
                Данные сохраняются автоматически
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                flexShrink: 0,
                flexWrap: 'wrap',
                justifyContent: 'flex-end',
                width: { xs: '100%', md: 'auto' },
                mt: { xs: 'auto', md: 0 },
                '& > *': { whiteSpace: 'nowrap' },
              }}
            >
              <Chip label={`${pets.length} питомцев`} variant="outlined" sx={{ color: 'white', borderColor: 'white' }} />
              <Chip label="Автосохранение" color="success" size="small" variant="outlined" sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white' }} />
              <IconButton onClick={handleRefresh} sx={{ color: 'white' }} title="Синхронизировать данные" size="small">
                <Refresh />
              </IconButton>
              <IconButton onClick={() => setEventLogOpen(true)} sx={{ color: 'white' }} title="Открыть журнал событий" size="small">
                <History />
              </IconButton>
            </Box>
          </Box>
        </div>
      </Paper>

      <Paper sx={{ p: 2, mb: 4 }}>
        <FormControl fullWidth>
          <InputLabel>Вид питомца</InputLabel>
          <Select value={speciesFilter} label="Вид питомца" onChange={onFilterChange}>
            {speciesOptions.map(species => (
              <MenuItem key={species} value={species}>
                {species === 'all' ? 'Все виды' : species}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {loading ? (
        <Grid container spacing={3} sx={{ width: '100%' }}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Skeleton variant="rectangular" height={420} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={3} sx={{ width: '100%' }}>
          {filteredPets.map(pet => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={pet.id}>
              <PetCard initialPet={pet} onUpdate={handleUpdatePet} />
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && filteredPets.length === 0 && (
        <Paper sx={{ p: 8, textAlign: 'center' }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Питомцы не найдены
          </Typography>
          <Typography color="text.secondary">Попробуйте изменить параметры фильтрации</Typography>
        </Paper>
      )}

      <EventLog isOpen={eventLogOpen} onClose={() => setEventLogOpen(false)} />
    </Container>
  );
};
