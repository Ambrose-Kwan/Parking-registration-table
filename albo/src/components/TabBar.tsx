import libraryIcon from '../assets/icons/library.svg'
import searchIcon from '../assets/icons/search-tab.svg'
import mapIcon from '../assets/icons/map.svg'
import communityIcon from '../assets/icons/users-round.svg'
import profileIcon from '../assets/icons/user-round.svg'
import activeDot from '../assets/icons/active-dot.svg'

const tabs = [
  { key: 'library', label: 'Library', icon: libraryIcon, active: false },
  { key: 'search', label: 'Search', icon: searchIcon, active: false },
  { key: 'map', label: 'Map', icon: mapIcon, active: false },
  { key: 'community', label: 'Community', icon: communityIcon, active: true },
  { key: 'profile', label: 'Profile', icon: profileIcon, active: false },
] as const

export function TabBar() {
  return (
    <nav className="tab-bar" aria-label="Primary">
      <div className="tab-bar__items">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`tab-bar__item ${tab.active ? 'is-active' : ''}`}
            aria-current={tab.active ? 'page' : undefined}
          >
            <img src={tab.icon} alt="" width={22} height={22} />
            <span>{tab.label}</span>
            {tab.active ? (
              <img className="tab-bar__dot" src={activeDot} alt="" width={3} height={3} />
            ) : null}
          </button>
        ))}
      </div>
      <div className="tab-bar__home">
        <span className="tab-bar__indicator" />
      </div>
    </nav>
  )
}
