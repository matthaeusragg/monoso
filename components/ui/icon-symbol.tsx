import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue } from 'react-native';

// Allow mapping to either MaterialIcons or MaterialCommunityIcons
type MaterialIconName =
  | ComponentProps<typeof MaterialIcons>['name']
  | ComponentProps<typeof MaterialCommunityIcons>['name'];

type IconMapping = Record<SymbolViewProps['name'], MaterialIconName>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols → Material Icons/MCI mappings here.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'bar-chart.fill': 'bar-chart',
  'list.fill': 'list',
  'pie-chart.fill': 'pie-chart',
  'reorder': 'menu',
  'edit': 'edit',
  'delete': 'delete-outline', // MCI icon
  'done': 'done',
  'save': 'save',
  'import': 'file-import', // MCI icon
  'document-text-outline' : 'document-text-outline',
  'settings' : 'settings',
} as unknown as IconMapping;

type IconSymbolProps = {
  name: IconSymbolName;
  weight?: SymbolWeight;
  size?: number;
  color?: string | OpaqueColorValue;
} & Omit<ComponentProps<typeof MaterialIcons>, 'name'> &
  Omit<ComponentProps<typeof MaterialCommunityIcons>, 'name'>;

/**
 * Cross-platform icon component:
 * - iOS: uses SF Symbols automatically (via expo-symbols)
 * - Android/web: uses MaterialIcons or MaterialCommunityIcons
 */
export function IconSymbol({ name, size = 24, color, ...restProps }: IconSymbolProps) {
  const iconName = MAPPING[name];

  // Determine which icon set the mapped name belongs to
  const isCommunityIcon = !!MaterialCommunityIcons.glyphMap[iconName];

  const IconComponent = isCommunityIcon ? MaterialCommunityIcons : MaterialIcons;

  return (
    <IconComponent
      name={iconName as any}
      size={size}
      color={color}
      {...restProps}
    />
  );
}
