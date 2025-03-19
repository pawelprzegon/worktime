<script setup>
import { ref, computed } from 'vue'

// Stan kalendarza
const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())

// Wydarzenia
const events = ref([
  {
    id: 1,
    title: 'Meeting',
    date: '2024-01-03',
    time: '10:00 - 11:00',
    color: 'purple'
  },
  {
    id: 2,
    title: 'Developer Meetup',
    date: '2024-01-07',
    time: '10:00 - 11:00',
    color: 'emerald'
  },
  {
    id: 3,
    title: 'Developer Meetup',
    date: '2024-01-19',
    time: '10:00 - 11:00',
    color: 'sky'
  },
  {
    id: 4,
    title: 'Friends Meet',
    date: '2024-01-04',
    time: '09:00 - 13:42',
    color: 'purple'
  }
])

// Dni tygodnia
const weekdays = ref(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])

// Nazwy miesięcy
const months = ref([
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
])

const currentMonthName = computed(() => {
  return `${months.value[currentMonth.value]} ${currentYear.value}`
})

// Obliczane właściwości
const days = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1).getDay()
  const lastDate = new Date(currentYear.value, currentMonth.value + 1, 0).getDate()

  const daysArray = []
  // Dodaj puste dni na początku (uwzględniając nową kolejność dni)
  for (let i = 0; i < ((firstDay - 1 + 7) % 7); i++) {
    daysArray.push({ date: '' })
  }

  // Dodaj rzeczywiste dni
  for (let i = 1; i <= lastDate; i++) {
    daysArray.push({ date: i })
  }

  return daysArray
})

// Funkcje pomocnicze
const isToday = (day) => {
  if (!day) return false
  const today = new Date()
  return today.getDate() === day &&
         today.getMonth() === currentMonth.value &&
         today.getFullYear() === currentYear.value
}

const hasEvent = (day) => {
  if (!day) return false
  const dateString = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  return events.value.some(event => event.date === dateString)
}

const getEventTitle = (day) => {
  if (!day) return ''
  const dateString = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const event = events.value.find(event => event.date === dateString)
  return event ? event.title : ''
}

const getEventTime = (day) => {
  if (!day) return ''
  const dateString = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const event = events.value.find(event => event.date === dateString)
  return event ? event.time : ''
}

// Nawigacja między miesiącami
const previousMonth = () => {
  currentMonth.value--
  if (currentMonth.value < 0) {
    currentMonth.value = 11
    currentYear.value--
  }
}

const nextMonth = () => {
  currentMonth.value++
  if (currentMonth.value > 11) {
    currentMonth.value = 0
    currentYear.value++
  }
}

// Obsługa wyboru daty
const selectDate = (day) => {
  if (!day) return
  console.log(`Wybrano datę: ${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`)
}
</script>

<template>
  <div class="relative bg-stone-50">
    <!-- Dekoracyjne elementy -->
    <div class="bg-sky-400 w-full sm:w-40 h-40 rounded-full absolute top-1 opacity-20 max-sm:right-0 sm:left-56 z-0"></div>
    <div class="bg-emerald-500 w-full sm:w-40 h-24 absolute top-0 -left-0 opacity-20 z-0"></div>
    <div class="bg-purple-600 w-full sm:w-40 h-24 absolute top-40 -left-0 opacity-20 z-0"></div>

    <!-- Główna zawartość -->
    <div class="w-full py-24 relative z-10 backdrop-blur-3xl">
      <div class="w-full max-w-7xl mx-auto px-2 lg:px-8">
        <div class="grid grid-cols-12 gap-8 max-w-4xl mx-auto xl:max-w-full">
          <!-- Lista wydarzeń -->
          <div class="col-span-12 xl:col-span-5">
            <h2 class="font-manrope text-3xl leading-tight text-gray-900 mb-1.5">Upcoming Events</h2>
            <p class="text-lg font-normal text-gray-600 mb-8">Don't miss schedule</p>
            <div class="flex gap-5 flex-col">
              <div v-for="event in events" :key="event.id" class="p-6 rounded-xl bg-white">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-2.5">
                    <span class="w-2.5 h-2.5 rounded-full" :class="`bg-${event.color}`"></span>
                    <p class="text-base font-medium text-gray-900">{{ event.date }} - {{ event.time }}</p>
                  </div>
                  <div class="dropdown relative inline-flex">
                    <button
                      type="button"
                      class="dropdown-toggle inline-flex justify-center py-2.5 px-1 items-center gap-2 text-sm text-black rounded-full cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 hover:text-purple-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="4" viewBox="0 0 12 4" fill="none">
                        <path d="M1.85624 2.00085H1.81458M6.0343 2.00085H5.99263M10.2124 2.00085H10.1707" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"></path>
                      </svg>
                    </button>
                    <div class="dropdown-menu rounded-xl shadow-lg bg-white absolute top-full -left-10 w-max mt-2 hidden">
                      <ul class="py-2">
                        <li>
                          <a class="block px-6 py-2 text-xs hover:bg-gray-100 text-gray-600 font-medium" href="javascript:;">Edit</a>
                        </li>
                        <li>
                          <a class="block px-6 py-2 text-xs hover:bg-gray-100 text-gray-600 font-medium" href="javascript:;">Remove</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <h6 class="text-xl leading-8 font-semibold text-black mb-1">{{ event.title }}</h6>
                <p class="text-base font-normal text-gray-600">{{ event.description }}</p>
              </div>
            </div>
          </div>

          <!-- Kalendarz -->
          <div class="col-span-12 xl:col-span-7 px-2.5 py-5 sm:p-8 bg-gradient-to-b from-white/25 to-white xl:bg-white rounded-2xl max-xl:row-start-1">
            <div class="flex flex-col md:flex-row gap-4 items-center justify-between mb-5">
              <div class="flex items-center gap-4">
                <h5 class="text-xl leading-8 font-semibold text-gray-900">{{ currentMonthName }}</h5>
                <div class="flex items-center">
                  <button
                    @click="previousMonth"
                    class="text-indigo-600 p-1 rounded transition-all duration-300 hover:text-white hover:bg-indigo-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M10.0002 11.9999L6 7.99971L10.0025 3.99719" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                  </button>
                  <button
                    @click="nextMonth"
                    class="text-indigo-600 p-1 rounded transition-all duration-300 hover:text-white hover:bg-indigo-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6.00236 3.99707L10.0025 7.99723L6 11.9998" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="flex items-center rounded-md p-1 bg-indigo-50 gap-px">
                <button class="py-2.5 px-5 rounded-lg bg-indigo-50 text-indigo-600 text-sm font-medium transition-all duration-300 hover:bg-indigo-600 hover:text-white">Day</button>
                <button class="py-2.5 px-5 rounded-lg bg-indigo-600 text-white text-sm font-medium transition-all duration-300 hover:bg-indigo-600 hover:text-white">Week</button>
                <button class="py-2.5 px-5 rounded-lg bg-indigo-50 text-indigo-600 text-sm font-medium transition-all duration-300 hover:bg-indigo-600 hover:text-white">Month</button>
              </div>
            </div>
            <div class="border border-indigo-200 rounded-xl">
              <div class="grid grid-cols-7 rounded-t-3xl border-b border-indigo-200">
                <div v-for="day in weekdays" :key="day"
                     class="py-3.5 border-r  border-indigo-200 bg-indigo-50 flex items-center justify-center text-sm font-medium text-indigo-600"
                     :class="day === 'Mon' ? 'rounded-tl-xl' : '' || day === 'Sun' ? 'rounded-tr-xl' : '' "
                >


                  {{ day }}
                </div>
              </div>
              <div class="grid grid-cols-7 rounded-b-xl">
                <div v-for="day in days" :key="day.date"
                     class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-white border-r border-b border-indigo-200 transition-all duration-300 hover:bg-indigo-50 cursor-pointer"
                     :class="{
                       'bg-indigo-50': isToday(day.date),
                       'bg-indigo-100': hasEvent(day.date)
                     }"
                     @click="selectDate(day.date)">
                  <span class="text-xs font-semibold text-gray-900">{{ day.date }}</span>
                  <div v-if="hasEvent(day.date)" class="absolute top-9 bottom-1 left-3.5 p-1.5 xl:px-2.5 h-max rounded bg-purple-50">
                    <p class="hidden xl:block text-xs font-medium text-purple-600 mb-px whitespace-nowrap">
                      {{ getEventTitle(day.date) }}
                    </p>
                    <span class="hidden xl:block text-xs font-normal text-purple-600 whitespace-nowrap">
                      {{ getEventTime(day.date) }}
                    </span>
                    <p class="xl:hidden w-2 h-2 rounded-full bg-purple-600"></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

