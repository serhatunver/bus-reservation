import { h } from 'vue';
import type { ColumnDef } from '@tanstack/vue-table';

import { z } from 'zod';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import DataTableColumnHeader from './DataTableColumnHeader.vue';

import DeleteTrip from './trip/DeleteTrip.vue';
import EditTrip from './trip/EditTrip.vue';

import DeleteStop from './stop/DeleteStop.vue';
import EditStop from './stop/EditStop.vue';

import DeleteBus from './bus/DeleteBus.vue';
import EditBus from './bus/EditBus.vue';

import DeleteReservation from './reservation/DeleteReservation.vue';
import EditReservation from './reservation/EditReservation.vue';

import DeleteUser from './user/DeleteUser.vue';
import EditUser from './user/EditUser.vue';

export const tripSchema = z.object({
  _id: z.string(),
  name: z.string(),
  route: z.array(
    z.object({
      from: z.object({
        _id: z.string(),
        name: z.string(),
      }),
      to: z.object({
        _id: z.string(),
        name: z.string(),
      }),
      price: z.number(),
      duration: z.number(),
    })
  ),
  departureTime: z.string(),
  arrivalTime: z.string(),
  bus: z.object({
    _id: z.string(),
    model: z.string(),
    modelYear: z.number(),
    capacity: z.number(),
    isActive: z.boolean(),
    plateNumber: z.string(),
  }),
});

export const reservationSchema = z.object({
  _id: z.string(),
  trip: tripSchema,
  pnr: z.string(),
  seatNumber: z.number(),
  fromStop: z.object({
    _id: z.string(),
    name: z.string(),
  }),
  toStop: z.object({
    _id: z.string(),
    name: z.string(),
  }),
  passengerName: z.string(),
  passengerSurname: z.string(),
  email: z.string().email(),
  phone: z.string(),
  status: z.enum(['booked', 'cancelled', 'completed']),
  passenger: z.object({
    _id: z.string(),
    name: z.string(),
    surname: z.string(),
    email: z.string().email(),
    phone: z.string(),
    reservations: z.array(z.string()), // Array of reservation IDs
  }),
});

export const userSchema = z.object({
  _id: z.string(),
  name: z.string(),
  surname: z.string(),
  email: z.string().email(),
  phone: z.string(),
  reservations: z.array(reservationSchema),
});

export const stopSchema = z.object({
  _id: z.string(),
  name: z.string(),
});

const busSchema = z.object({
  _id: z.string(),
  capacity: z.number(),
  model: z.string(),
  modelYear: z.number(),
  plateNumber: z.string(),
  isActive: z.boolean(),
  trips: z.array(tripSchema),
});

export type Trip = z.infer<typeof tripSchema>;
export type Stop = z.infer<typeof stopSchema>;
export type Reservation = z.infer<typeof reservationSchema>;
export type User = z.infer<typeof userSchema>;
export type Bus = z.infer<typeof busSchema>;

export const tripColumns: ColumnDef<Trip>[] = [
  {
    accessorKey: 'select',
    header: () =>
      h(Checkbox, {
        ariaLabel: 'Select all',
      }),
    cell: () => h(Checkbox),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'route',
    header: () => h('div', 'Route'),
    cell: ({ row }) =>
      h(
        'div',
        `${row.original.route[0].from.name} - ${
          row.original.route[row.original.route.length - 1].to.name
        }`
      ),
  },
  {
    accessorKey: 'departureTime',
    header: () => h('div', 'Departure Date'),
    cell: ({ row }) =>
      h(
        'div',
        new Date(row.original.departureTime).toLocaleDateString('tr-TR') +
          ' - ' +
          new Date(row.original.departureTime).toLocaleTimeString('tr-TR')
      ),
  },
  {
    accessorKey: 'arrivalTime',
    header: () => h('div', 'Arrival Date'),
    cell: ({ row }) =>
      h(
        'div',
        new Date(row.original.arrivalTime).toLocaleDateString('tr-TR') +
          ' - ' +
          new Date(row.original.arrivalTime).toLocaleTimeString('tr-TR')
      ),
  },
  {
    accessorKey: 'bus.model',
    header: () => h('div', 'Bus Model'),
    cell: ({ row }) => h('div', row.original.bus.model),
  },
  {
    accessorKey: 'bus.plateNumber',
    header: () => h('div', 'Bus Plate Number'),
    cell: ({ row }) => h('div', row.original.bus.plateNumber),
  },
  {
    accessorKey: 'bus.capacity',
    header: 'Bus Capacity',
    cell: ({ row }) => h('div', row.original.bus.capacity),
  },
  {
    accessorKey: 'actions',
    header: () => h('div', 'Actions'),
    cell: ({ row }) => {
      const editTrip = h(EditTrip, {
        trip: row.original,
        class: 'w-6 h-6',
      });
      const deleteTrip = h(DeleteTrip, {
        tripId: row.original._id,
        class: 'w-6 h-6',
      });
      return h('div', { class: 'flex gap-2' }, [deleteTrip, editTrip]);
    },
  },
];

export const reservationColumns: ColumnDef<Reservation>[] = [
  {
    accessorKey: 'select',
    header: () =>
      h(Checkbox, {
        ariaLabel: 'Select all',
      }),
    cell: () => h(Checkbox),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'pnr',
    header: ({ column }) =>
      h(DataTableColumnHeader<Reservation>, {
        column,
        title: 'PNR',
      }),
    cell: ({ row }) => h('div', row.getValue('pnr')),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'fromStop',
    header: () => h('div', 'From Stop'),
    cell: ({ row }) => h('div', row.original.fromStop.name),
  },
  {
    accessorKey: 'toStop',
    header: () => h('div', 'To Stop'),
    cell: ({ row }) => h('div', row.original.toStop.name),
  },
  {
    accessorKey: 'date',
    header: () => h('div', 'Date'),
    cell: ({ row }) =>
      h(
        'div',
        new Date(row.original.trip.departureTime).toLocaleDateString('tr-TR')
      ),
  },
  {
    accessorKey: 'seatNumber',
    header: ({ column }) =>
      h(DataTableColumnHeader<Reservation>, {
        column,
        title: 'Seat',
      }),
    cell: ({ row }) => {
      return h('div', row.getValue('seatNumber'));
    },
  },
  {
    accessorKey: 'passengerFullName',
    header: () => h('div', 'Full Name'),
    cell: ({ row }) => {
      const fromUser = row.original.passenger;
      const nameFromUser =
        fromUser?.name && fromUser?.surname
          ? `${fromUser.name} ${fromUser.surname}`
          : null;

      const nameFromReservation =
        row.original.passengerName && row.original.passengerSurname
          ? `${row.original.passengerName} ${row.original.passengerSurname}`
          : null;

      const fullName = nameFromUser || nameFromReservation || '-';
      return h('div', fullName);
    },
  },
  {
    accessorKey: 'status',
    header: () => h('div', 'Status'),
    cell: ({ row }) => h('div', row.getValue('status')),
  },
  {
    accessorKey: 'email',
    header: () => h('div', 'Passenger Email'),
    cell: ({ row }) => {
      const email = row.original.passenger?.email ?? row.original.email;
      return h('div', email || '-');
    },
  },
  {
    accessorKey: 'phone',
    header: () => h('div', 'Passenger Phone'),
    cell: ({ row }) => {
      const phone = row.original.passenger?.phone ?? row.original.phone;
      return h('div', phone || '-');
    },
  },
  {
    accessorKey: 'actions',
    header: () => h('div', 'Actions'),
    cell: ({ row }) => {
      const editReservation = h(EditReservation, {
        reservation: row.original,
        class: 'w-6 h-6',
      });
      const deleteReservation = h(DeleteReservation, {
        reservationId: row.original._id,
        class: 'w-6 h-6',
      });
      return h('div', { class: 'flex gap-2' }, [
        deleteReservation,
        editReservation,
      ]);
    },
  },
];

export const stopColumns: ColumnDef<Stop>[] = [
  {
    accessorKey: 'select',
    header: () =>
      h(Checkbox, {
        ariaLabel: 'Select all',
      }),
    cell: () => h(Checkbox),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: '_id',
    header: () => h('div', 'Id'),
    cell: ({ row }) => h('div', row.getValue('_id')),
  },
  {
    accessorKey: 'name',
    header: ({ column }) =>
      h(DataTableColumnHeader<Stop>, {
        column,
        title: 'Stop Name',
      }),
    cell: ({ row }) => h('div', row.getValue('name')),
  },
  {
    accessorKey: 'actions',
    header: () => h('div', 'Actions'),
    cell: ({ row }) => {
      const editStop = h(EditStop, {
        stopId: row.original._id,
        stopName: row.original.name,
        class: 'w-6 h-6',
      });
      const deleteStop = h(DeleteStop, {
        stopId: row.original._id,
        stopName: row.original.name,
        class: 'w-6 h-6',
      });
      return h('div', { class: 'flex gap-2' }, [deleteStop, editStop]);
    },
  },
];

export const busColumns: ColumnDef<Bus>[] = [
  {
    accessorKey: 'select',
    header: () =>
      h(Checkbox, {
        ariaLabel: 'Select all',
      }),
    cell: () => h(Checkbox),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: '_id',
    header: () => h('div', 'Id'),
    cell: ({ row }) => h('div', row.getValue('_id')),
  },
  {
    accessorKey: 'model',
    header: ({ column }) =>
      h(DataTableColumnHeader<Bus>, {
        column,
        title: 'Model',
      }),
    cell: ({ row }) => h('div', row.getValue('model')),
  },
  {
    accessorKey: 'plateNumber',
    header: () => h('div', 'Plate Number'),
    cell: ({ row }) => h('div', row.getValue('plateNumber')),
  },
  {
    accessorKey: 'capacity',
    header: () => h('div', 'Capacity'),
    cell: ({ row }) => h('div', row.getValue('capacity')),
  },
  {
    accessorKey: 'modelYear',
    header: () => h('div', 'Model Year'),
    cell: ({ row }) => h('div', row.getValue('modelYear')),
  },
  {
    accessorKey: 'isActive',
    header: () => h('div', 'Active'),
    cell: ({ row }) => h('div', row.getValue('isActive') ? 'Yes' : 'No'),
  },
  {
    accessorKey: 'actions',
    header: () => h('div', 'Actions'),
    cell: ({ row }) => {
      const editBus = h(EditBus, {
        bus: row.original,
        class: 'w-6 h-6',
      });
      const deleteBus = h(DeleteBus, {
        busId: row.original._id,
        class: 'w-6 h-6',
      });
      return h('div', { class: 'flex gap-2' }, [deleteBus, editBus]);
    },
  },
];

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'select',
    header: () =>
      h(Checkbox, {
        ariaLabel: 'Select all',
      }),
    cell: () => h(Checkbox),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: '_id',
    header: () => h('div', 'Id'),
    cell: ({ row }) => h('div', row.getValue('_id')),
  },
  {
    accessorKey: 'name',
    header: ({ column }) =>
      h(DataTableColumnHeader<User>, {
        column,
        title: 'Name',
      }),
    cell: ({ row }) => h('div', row.getValue('name')),
  },
  {
    accessorKey: 'surname',
    header: () => h('div', 'Surname'),
    cell: ({ row }) => h('div', row.getValue('surname')),
  },
  {
    accessorKey: 'email',
    header: () => h('div', 'Email'),
    cell: ({ row }) => h('div', row.getValue('email')),
  },
  {
    accessorKey: 'phone',
    header: () => h('div', 'Phone'),
    cell: ({ row }) => h('div', row.getValue('phone')),
  },
  {
    accessorKey: 'actions',
    header: () => h('div', 'Actions'),
    cell: ({ row }) => {
      const editUser = h(EditUser, {
        user: row.original,
        class: 'w-6 h-6',
      });
      const deleteUser = h(DeleteUser, {
        userId: row.original._id,
        class: 'w-6 h-6',
      });
      return h('div', { class: 'flex gap-2' }, [deleteUser, editUser]);
    },
  },
];
