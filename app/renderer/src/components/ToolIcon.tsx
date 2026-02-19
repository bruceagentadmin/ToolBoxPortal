import { getIconComponent, autoResolveIconKey } from './icon-registry'

interface ToolIconProps {
  /** Manually selected icon key from config.icon */
  iconKey?: string
  name: string
  command: string
  tags?: string[]
  size?: number
}

export function ToolIcon({ iconKey, name, command, tags, size = 20 }: ToolIconProps) {
  const resolvedKey = iconKey || autoResolveIconKey(name, command, tags)
  const Icon = getIconComponent(resolvedKey)
  return <Icon size={size} className="tool-icon" />
}
