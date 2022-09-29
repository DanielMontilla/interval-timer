const useTheme = () => ({
  toggleTheme,
  changeTheme
});

type Theme = 'dark' | 'light';
const _getTheme = (): Theme => document.documentElement.classList.contains('dark') ? 'dark' : 'light';
const toggleTheme = () => changeTheme(_getTheme() == 'light' ? 'dark' : 'light');
const changeTheme = (theme: Theme): Theme => {
  let el = document.documentElement;
  if (theme == 'light' && _getTheme() == 'dark') {
    el.classList.remove('dark');
    return 'light';
  } else {
    el.classList.add('dark');
    return 'dark';
  }
}


export default useTheme;