import Typography from 'typography'
import '../styles/camphor.scss';
import '../styles/minimo.css';
import '../styles/custom.css';

const typography = new Typography({
  bodyFontFamily: ['Camphor'],
  headerFontFamily: ['Camphor'],
})

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles()
}

export default typography
