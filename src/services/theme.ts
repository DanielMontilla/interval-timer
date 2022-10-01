import { ref } from "vue";

const useTheme = () => ({
  toggleTheme,
  changeTheme,
  theme
});

type Theme = 'dark' | 'light';
const _getTheme = (): Theme => document.documentElement.classList.contains('dark') ? 'dark' : 'light';
const theme = ref<Theme>(_getTheme());
const toggleTheme = () => changeTheme(_getTheme() == 'light' ? 'dark' : 'light');
const changeTheme = (t: Theme): Theme => {
  let el = document.documentElement;
  if (t == 'light' && _getTheme() == 'dark') {
    el.classList.remove('dark');
    theme.value = 'light';
    return 'light';
  } else {
    el.classList.add('dark');
    theme.value = 'dark';
    return 'dark';
  }
}


export default useTheme;