import MenuDayButton from '../../molecules/MenuDayButton';
import MenuItemButton from '../../molecules/MenuItemButton';

export default function WeeklyMenuTable() {
  return (
    <div className='grid grid-cols-[80px_repeat(3,1fr)] gap-6'>
      <MenuDayButton label='월요일' focused={true} />
      <MenuItemButton time='아침' menus={dummyMenu} />
      <MenuItemButton time='점심' menus={dummyMenu} />
      <MenuItemButton time='저녁' menus={dummyMenu} focused={true} />
      <MenuDayButton label='화요일' />
      <MenuItemButton time='아침' menus={dummyMenu} />
      <MenuItemButton time='점심' menus={dummyMenu} />
      <MenuItemButton time='저녁' menus={dummyMenu} />
      <MenuDayButton label='수요일' />
      <MenuItemButton time='아침' menus={dummyMenu} />
      <MenuItemButton time='점심' menus={dummyMenu} />
      <MenuItemButton time='저녁' menus={dummyMenu} />
      <MenuDayButton label='목요일' />
      <MenuItemButton time='아침' menus={dummyMenu} />
      <MenuItemButton time='점심' menus={dummyMenu} />
      <MenuItemButton time='저녁' menus={dummyMenu} />
      <MenuDayButton label='금요일' />
      <MenuItemButton time='아침' menus={dummyMenu} />
      <MenuItemButton time='점심' menus={dummyMenu} />
      <MenuItemButton time='저녁' menus={dummyMenu} />
    </div>
  );
}

const dummyMenu = ['사골떡국', '쌀밥', '생선가스&칠리소스', '두부양념조림', '해초샐러드', '깍두기'];
