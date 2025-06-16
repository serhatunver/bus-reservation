import mongoose from 'mongoose';

const mongoURI = 'mongodb://localhost:27017/bus-reservation'; // change as needed

// ----- SCHEMAS -----

import Bus from './models/bus.model.js';
import Stop from './models/stop.model.js';
import Trip from './models/trip.model.js';
import Reservation from './models/reservation.model.js';
import User from './models/user.model.js';

// ----- SEED FUNCTION -----

async function seed() {
  await mongoose.connect(mongoURI);
  console.log('Connected to MongoDB!');

  // Clean existing data
  await Stop.deleteMany({});
  await Bus.deleteMany({});
  await Trip.deleteMany({});
  await Reservation.deleteMany({});
  await User.deleteMany({});

  // Insert stops
  const stops = await Stop.insertMany([
    { name: 'Adana' },
    { name: 'Adıyaman' },
    { name: 'Afyonkarahisar' },
    { name: 'Ağrı' },
    { name: 'Aksaray' },
    { name: 'Amasya' },
    { name: 'Ankara' },
    { name: 'Antalya' },
    { name: 'Ardahan' },
    { name: 'Artvin' },
    { name: 'Aydın' },
    { name: 'Balıkesir' },
    { name: 'Bartın' },
    { name: 'Batman' },
    { name: 'Bayburt' },
    { name: 'Bilecik' },
    { name: 'Bingöl' },
    { name: 'Bitlis' },
    { name: 'Bolu' },
    { name: 'Burdur' },
    { name: 'Bursa' },
    { name: 'Çanakkale' },
    { name: 'Çankırı' },
    { name: 'Çorum' },
    { name: 'Denizli' },
    { name: 'Diyarbakır' },
    { name: 'Düzce' },
    { name: 'Edirne' },
    { name: 'Elazığ' },
    { name: 'Erzincan' },
    { name: 'Erzurum' },
    { name: 'Eskişehir' },
    { name: 'Gaziantep' },
    { name: 'Giresun' },
    { name: 'Gümüşhane' },
    { name: 'Hakkari' },
    { name: 'Hatay' },
    { name: 'Iğdır' },
    { name: 'Isparta' },
    { name: 'İstanbul' },
    { name: 'İzmir' },
    { name: 'Kahramanmaraş' },
    { name: 'Karabük' },
    { name: 'Karaman' },
    { name: 'Kars' },
    { name: 'Kastamonu' },
    { name: 'Kayseri' },
    { name: 'Kırıkkale' },
    { name: 'Kırklareli' },
    { name: 'Kırşehir' },
    { name: 'Kocaeli' },
    { name: 'Konya' },
    { name: 'Kütahya' },
    { name: 'Malatya' },
    { name: 'Manisa' },
    { name: 'Mardin' },
    { name: 'Mersin' },
    { name: 'Muğla' },
    { name: 'Muş' },
    { name: 'Nevşehir' },
    { name: 'Niğde' },
    { name: 'Ordu' },
    { name: 'Osmaniye' },
    { name: 'Rize' },
    { name: 'Sakarya' },
    { name: 'Samsun' },
    { name: 'Siirt' },
    { name: 'Sinop' },
    { name: 'Sivas' },
    { name: 'Şanlıurfa' },
    { name: 'Şırnak' },
    { name: 'Tekirdağ' },
    { name: 'Tokat' },
    { name: 'Trabzon' },
    { name: 'Tunceli' },
    { name: 'Uşak' },
    { name: 'Van' },
    { name: 'Yalova' },
    { name: 'Yozgat' },
    { name: 'Zonguldak' },
    { name: 'Kilis' },
  ]);

  // ----- Stops -----
  const malatya = await Stop.findOne({ name: 'Malatya' });
  const kahramanmaras = await Stop.findOne({ name: 'Kahramanmaraş' });
  const osmaniye = await Stop.findOne({ name: 'Osmaniye' });
  const adana = await Stop.findOne({ name: 'Adana' });
  const mersin = await Stop.findOne({ name: 'Mersin' });
  const istanbul = await Stop.findOne({ name: 'İstanbul' });
  const ankara = await Stop.findOne({ name: 'Ankara' });
  const konya = await Stop.findOne({ name: 'Konya' });

  // ----- Seats -----
  const seats = [
    { seatNumber: 1, row: 1, column: 1 },
    { seatNumber: 2, row: 1, column: 3 },
    { seatNumber: 3, row: 1, column: 4 },
    { seatNumber: 4, row: 2, column: 1 },
    { seatNumber: 5, row: 2, column: 3 },
    { seatNumber: 6, row: 2, column: 4 },
    { seatNumber: 7, row: 3, column: 1 },
    { seatNumber: 8, row: 3, column: 3 },
    { seatNumber: 9, row: 3, column: 4 },
    { seatNumber: 10, row: 4, column: 1 },
    { seatNumber: 11, row: 4, column: 3 },
    { seatNumber: 12, row: 4, column: 4 },
    { seatNumber: 13, row: 5, column: 1 },
    { seatNumber: 14, row: 5, column: 3 },
    { seatNumber: 15, row: 5, column: 4 },
    { seatNumber: 16, row: 6, column: 1 },
    { seatNumber: 17, row: 6, column: 3 },
    { seatNumber: 18, row: 6, column: 4 },
    { seatNumber: 19, row: 7, column: 1 },
    { seatNumber: 20, row: 7, column: 3 },
    { seatNumber: 21, row: 7, column: 4 },
    { seatNumber: 22, row: 8, column: 1 },
    { seatNumber: 23, row: 9, column: 1 },
    { seatNumber: 24, row: 9, column: 3 },
    { seatNumber: 25, row: 9, column: 4 },
    { seatNumber: 26, row: 10, column: 1 },
    { seatNumber: 27, row: 10, column: 3 },
    { seatNumber: 28, row: 10, column: 4 },
    { seatNumber: 29, row: 11, column: 1 },
    { seatNumber: 30, row: 11, column: 3 },
    { seatNumber: 31, row: 11, column: 4 },
    { seatNumber: 32, row: 12, column: 1 },
    { seatNumber: 33, row: 12, column: 3 },
    { seatNumber: 34, row: 12, column: 4 },
    { seatNumber: 35, row: 13, column: 1 },
    { seatNumber: 36, row: 13, column: 3 },
    { seatNumber: 37, row: 13, column: 4 },
    { seatNumber: 38, row: 14, column: 1 },
    { seatNumber: 39, row: 14, column: 2 },
    { seatNumber: 40, row: 14, column: 3 },
    { seatNumber: 41, row: 14, column: 4 },
  ];

  // ----- Bus -----
  const bus1 = await Bus.create({
    capacity: 41,
    model: 'Mercedes Travego',
    modelYear: 2020,
    plateNumber: '34ABC123',
    seats: seats, // Tüm koltukları ekle
  });

  const bus2 = await Bus.create({
    capacity: 41,
    model: 'Volvo B11R',
    modelYear: 2021,
    plateNumber: '34XYZ456',
    seats: seats, // Tüm koltukları ekle
  });

  const bus3 = await Bus.create({
    capacity: 41,
    model: 'Scania Touring',
    modelYear: 2022,
    plateNumber: '34LMN789',
    seats: seats, // Tüm koltukları ekle
  });

  const bus4 = await Bus.create({
    capacity: 41,
    model: 'Setra S516 HD',
    modelYear: 2023,
    plateNumber: '34OPQ012',
    seats: seats, // Tüm koltukları ekle
  });

  const bus5 = await Bus.create({
    capacity: 41,
    model: 'Neoplan Tourliner',
    modelYear: 2024,
    plateNumber: '34RST345',
    seats: seats, // Tüm koltukları ekle
  });

  // ----- Trip -----
  const now = new Date();
  const trip1 = await Trip.create({
    name: 'Malatya Mersin',
    bus: bus1._id,
    departureTime: now,
    arrivalTime: new Date(now.getTime() + 8 * 60 * 60 * 1000), // +8 saat
    route: [
      {
        from: malatya._id,
        to: kahramanmaras._id,
        price: 400,
        duration: 180,
      },
      {
        from: kahramanmaras._id,
        to: osmaniye._id,
        price: 200,
        duration: 60,
      },
      {
        from: osmaniye._id,
        to: adana._id,
        price: 200,
        duration: 60,
      },
      {
        from: adana._id,
        to: mersin._id,
        price: 200,
        duration: 60,
      },
    ],
  });

  // Bus'a trip ilişkilendir
  bus1.trips = [trip1._id];
  await bus1.save();

  const trip2 = await Trip.create({
    name: 'İstanbul Konya',
    bus: bus2._id,
    departureTime: now,
    arrivalTime: new Date(now.getTime() + 10 * 60 * 60 * 1000), // +10 saat
    route: [
      {
        from: istanbul._id,
        to: ankara._id,
        price: 300,
        duration: 240,
      },
      {
        from: ankara._id,
        to: konya._id,
        price: 200,
        duration: 120,
      },
    ],
  });

  // Bus'a trip ilişkilendir
  bus2.trips = [trip2._id];
  await bus2.save();

  const trip3 = await Trip.create({
    name: 'Konya İstanbul',
    bus: bus3._id,
    departureTime: now,
    arrivalTime: new Date(now.getTime() + 10 * 60 * 60 * 1000), // +10 saat
    route: [
      {
        from: konya._id,
        to: ankara._id,
        price: 200,
        duration: 120,
      },
      {
        from: ankara._id,
        to: istanbul._id,
        price: 300,
        duration: 240,
      },
    ],
  });

  // Bus'a trip ilişkilendir
  bus3.trips = [trip3._id];
  await bus3.save();

  const trip4 = await Trip.create({
    name: 'Mersin Malatya',
    bus: bus4._id,
    departureTime: now,
    arrivalTime: new Date(now.getTime() + 8 * 60 * 60 * 1000), // +8 saat
    route: [
      {
        from: mersin._id,
        to: adana._id,
        price: 200,
        duration: 60,
      },
      {
        from: adana._id,
        to: osmaniye._id,
        price: 200,
        duration: 60,
      },
      {
        from: osmaniye._id,
        to: kahramanmaras._id,
        price: 200,
        duration: 60,
      },
      {
        from: kahramanmaras._id,
        to: malatya._id,
        price: 400,
        duration: 180,
      },
    ],
  });

  // Bus'a trip ilişkilendir
  bus4.trips = [trip4._id];
  await bus4.save();

  // ----- User -----
  const user1 = await User.create({
    name: 'Ahmet',
    surname: 'Yılmaz',
    email: 'ahmet@example.com',
    password: 'hashed_password_here', // şifre hashlenmeli!
    phone: '05554443322',
  });

  const user2 = await User.create({
    name: 'Mehmet',
    surname: 'Demir',
    email: 'mehmet@example.com',
    password: 'hashed_password_here', // şifre hashlenmeli!
    phone: '05556667788',
  });

  const user3 = await User.create({
    name: 'Ayşe',
    surname: 'Kaya',
    email: 'ayse@example.com',
    password: 'hashed_password_here', // şifre hashlenmeli!
    phone: '05558889900',
  });

  // ----- Admin User -----

  const adminUser = await User.create({
    name: 'Admin',
    surname: 'User',
    email: 'admin@example.com',
    password: 'hashed_password_here', // şifre hashlenmeli!
    phone: '05550001111',
    role: 'admin',
  });

  // ----- Reservation -----
  const reservation1 = await Reservation.create({
    trip: trip1._id,
    seatNumber: 1,
    fromStop: malatya._id,
    toStop: adana._id,
    passengerName: 'Serhat',
    passengerSurname: 'Ünver',
    email: 'serhat@example.com',
    phone: '05551234567',
    price: 800, // Malatya'dan Adana'ya toplam fiyat
    status: 'booked', // User ile ilişkilendir
  });

  const reservation2 = await Reservation.create({
    trip: trip1._id,
    seatNumber: 2,
    fromStop: malatya._id,
    toStop: osmaniye._id,
    passengerName: 'Bob',
    passengerSurname: 'Smith',
    email: 'bob@example.com',
    phone: '05552345678',
    price: 600, // Malatya'dan Osmaniye'ye toplam fiyat
    status: 'booked', // User ile ilişkilendir
  });

  const reservation3 = await Reservation.create({
    trip: trip1._id,
    seatNumber: 3,
    fromStop: malatya._id,
    toStop: kahramanmaras._id,
    passengerName: 'Charlie',
    passengerSurname: 'Brown',
    email: 'charlie@example.com',
    phone: '05553456789',
    price: 400, // Malatya'dan Kahramanmaraş'a toplam fiyat
    status: 'booked', // User ile ilişkilendir
  });

  const reservation4 = await Reservation.create({
    trip: trip1._id,
    seatNumber: 4,
    fromStop: malatya._id,
    toStop: osmaniye._id,
    passengerName: 'Alice',
    passengerSurname: 'Johnson',
    email: 'alice@example.com',
    phone: '05554567890',
    price: 600, // Malatya'dan Osmaniye'ye toplam fiyat
    status: 'booked', // User ile ilişkilendir
  });

  const reservation5 = await Reservation.create({
    trip: trip2._id,
    seatNumber: 1,
    fromStop: istanbul._id,
    toStop: ankara._id,
    passengerName: 'John',
    passengerSurname: 'Doe',
    email: 'john@example.com',
    phone: '05555678901',
    price: 300, // İstanbul'dan Ankara'ya toplam fiyat
    status: 'booked', // User ile ilişkilendir
  });
  const reservation6 = await Reservation.create({
    trip: trip2._id,
    seatNumber: 2,
    fromStop: istanbul._id,
    toStop: konya._id,
    passengerName: 'Jane',
    passengerSurname: 'Doe',
    email: 'jane@example.com',
    phone: '05556789012',
    price: 500, // İstanbul'dan Konya'ya toplam fiyat
    status: 'booked', // User ile ilişkilendir
  });
  const reservation7 = await Reservation.create({
    trip: trip3._id,
    seatNumber: 1,
    fromStop: konya._id,
    toStop: ankara._id,
    passengerName: 'Alex',
    passengerSurname: 'Smith',
    email: 'alice@example.com',
    phone: '05557890123',
    price: 200, // Konya'dan Ankara'ya toplam fiyat
    status: 'booked', // User ile ilişkilendir
  });

  const reservation8 = await Reservation.create({
    trip: trip3._id,
    seatNumber: 2,
    fromStop: konya._id,
    toStop: istanbul._id,
    passengerName: 'Robert',
    passengerSurname: 'Johnson',
    email: 'robert@example.com',
    phone: '05558901234',
    price: 500, // Konya'dan İstanbul'a toplam fiyat
    status: 'booked', // User ile ilişkilendir
  });

  const reservation9 = await Reservation.create({
    trip: trip4._id,
    seatNumber: 1,
    fromStop: mersin._id,
    toStop: adana._id,
    passengerName: 'Emily',
    passengerSurname: 'Davis',
    email: 'emily@example.com',
    phone: '05559012345',
    price: 200, // Mersin'den Adana'ya toplam fiyat
    status: 'booked', // User ile ilişkilendir
  });

  const reservation10 = await Reservation.create({
    trip: trip4._id,
    seatNumber: 2,
    fromStop: mersin._id,
    toStop: osmaniye._id,
    passengerName: 'Michael',
    passengerSurname: 'Wilson',
    email: 'michael@example.com',
    phone: '05550123456',
    price: 400, // Mersin'den Osmaniye'ye toplam fiyat
    status: 'booked', // User ile ilişkilendir
  });
  const reservation11 = await Reservation.create({
    trip: trip4._id,
    seatNumber: 3,
    fromStop: mersin._id,
    toStop: kahramanmaras._id,
    passengerName: 'Sarah',
    passengerSurname: 'Garcia',
    email: 'sarah@example.com',
    phone: '05551234567',
    price: 600, // Mersin'den Kahramanmaraş'a toplam fiyat
    status: 'booked', // User ile ilişkilendir
  });
  const reservation12 = await Reservation.create({
    trip: trip4._id,
    seatNumber: 4,
    fromStop: mersin._id,
    toStop: malatya._id,
    passengerName: 'David',
    passengerSurname: 'Martinez',
    email: 'david@example.com',
    phone: '05552345678',
    price: 800, // Mersin'den Malatya'ya toplam fiyat
    status: 'booked', // User ile ilişkilendir
  });

  const reservation13 = await Reservation.create({
    trip: trip1._id,
    seatNumber: 5,
    fromStop: malatya._id,
    toStop: adana._id,
    passenger: user1._id, // User ile ilişkilendir
    price: 800, // Malatya'dan Adana'ya toplam fiyat
    status: 'booked',
  });

  // ilişkilendirme
  user1.reservations.push(reservation13._id);
  await user1.save();

  const reservation14 = await Reservation.create({
    trip: trip2._id,
    seatNumber: 6,
    fromStop: istanbul._id,
    toStop: ankara._id,
    passenger: user2._id, // User ile ilişkilendir
    price: 300, // İstanbul'dan Ankara'ya toplam fiyat
    status: 'booked',
  });

  // ilişkilendirme
  user2.reservations.push(reservation14._id);
  await user2.save();

  const reservation15 = await Reservation.create({
    trip: trip3._id,
    seatNumber: 7,
    fromStop: konya._id,
    toStop: ankara._id,
    passenger: user3._id, // User ile ilişkilendir
    price: 200, // Konya'dan Ankara'ya toplam fiyat
    status: 'booked',
  });

  // ilişkilendirme
  user3.reservations.push(reservation15._id);
  await user3.save();

  console.log('Seed complete!');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  mongoose.disconnect();
});
