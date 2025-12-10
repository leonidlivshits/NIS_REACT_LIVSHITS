import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { User, CreateUserDto, UpdateUserDto } from '../../types/user.types'

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://jsonplaceholder.typicode.com/',
    prepareHeaders: (headers) => {
      headers.set('Authorization', 'Bearer demo-token-12345')
      return headers
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => 'users',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
      transformResponse: (response: User[]) => {
        return response.slice(0, 10)
      },
    }),

    createUser: builder.mutation<User, CreateUserDto>({
      query: (newUser) => ({
        url: 'users',
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
      async onQueryStarted(newUser, { dispatch, queryFulfilled }) {
        try {
          const { data: createdUser } = await queryFulfilled
          console.log('Пользователь создан:', createdUser)
          
          dispatch(
            usersApi.util.updateQueryData('getUsers', undefined, (draft) => {
              draft.unshift({ ...createdUser, id: Date.now() })
            })
          )
        } catch (error) {
          console.error('Ошибка создания пользователя:', error)
        }
      },
    }),

    updateUser: builder.mutation<User, { id: number; updates: UpdateUserDto }>({
      query: ({ id, updates }) => ({
        url: `users/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
      async onQueryStarted({ id, updates }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedUser } = await queryFulfilled
          console.log('Пользователь обновлен:', updatedUser)
          
          dispatch(
            usersApi.util.updateQueryData('getUsers', undefined, (draft) => {
              const userIndex = draft.findIndex(user => user.id === id)
              if (userIndex !== -1) {
                draft[userIndex] = { ...draft[userIndex], ...updatedUser }
              }
            })
          )
        } catch (error) {
          console.error('Ошибка обновления пользователя:', error)
        }
      },
    }),

    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'User', id }],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          usersApi.util.updateQueryData('getUsers', undefined, (draft) => {
            return draft.filter(user => user.id !== id)
          })
        )
        
        try {
          await queryFulfilled
          console.log('Пользователь удален:', id)
        } catch (error) {
          patchResult.undo()
          console.error('Ошибка удаления пользователя:', error)
        }
      },
    }),
  }),
})

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi