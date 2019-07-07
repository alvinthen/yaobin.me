import Typography from 'typography'
import '../styles/minimo.css';
import '../styles/custom.scss';

const typography = new Typography({
  bodyFontFamily: ['Average Sans'],
  headerFontFamily: ['Average Sans'],
})

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles()
}

const { rhythm, scale } = typography;
export { rhythm, scale, typography as default };
