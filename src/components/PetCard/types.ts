export type Mood = 'happy' | 'content' | 'sad' | 'angry' | 'excited';


export interface Pet {
id: string;
name: string;
species: string;
mood: Mood;
energy: number;
level: number;
avatar: string;
}


export type PetAction =
| { type: 'FEED' }
| { type: 'LEVEL_UP' }
| { type: 'CHEER' }
| { type: 'RESET' }
| { type: 'UPDATE_ENERGY'; payload: number }
| { type: 'UPDATE_MOOD'; payload: Mood };


export type PetState = Pet;