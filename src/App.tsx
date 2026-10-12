import type { ComponentType } from 'react'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { SoundControls } from './components/ui/SoundControls'
import { GameProvider } from './context/GameProvider'
import { SoundProvider } from './context/SoundProvider'
import { useGame } from './hooks/useGame'
import { AchievementsScreen } from './screens/AchievementsScreen'
import { FarewellScreen } from './screens/FarewellScreen'
import { HomeScreen } from './screens/HomeScreen'
import { MenuScreen } from './screens/MenuScreen'
import { LookCreatorScreen } from './screens/creator/LookCreatorScreen'
import { DiaryScreen } from './screens/diary/DiaryScreen'
import { LearnScreen } from './screens/learn/LearnScreen'
import type { ScreenId } from './types/game.types'

const SCREENS: Record<ScreenId, ComponentType> = {
  home: HomeScreen,
  menu: MenuScreen,
  creator: LookCreatorScreen,
  diary: DiaryScreen,
  learn: LearnScreen,
  achievements: AchievementsScreen,
  farewell: FarewellScreen,
}

function CurrentScreen() {
  const { state } = useGame()
  const Screen = SCREENS[state.screen]
  return <Screen />
}

export function App() {
  return (
    <ErrorBoundary>
      <SoundProvider>
        <GameProvider>
          <SoundControls />
          <CurrentScreen />
        </GameProvider>
      </SoundProvider>
    </ErrorBoundary>
  )
}
