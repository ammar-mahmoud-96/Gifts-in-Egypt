type ProductColorSource = {
  category: string
  title: string
  colors?: string[]
}

const feminineColorTerms = [
  'pink',
  'rose',
  'lavender',
  'lilac',
  'purple',
  'berry',
  'petal',
  'pixie',
  'primrose',
  'sweet pea',
  'ballerina',
  'orchid',
  'tulip',
  'peach',
  'daisy',
  'flutter',
  'daydream',
  'pillow talk'
]

const normalColors = [
  { name: 'Black', pattern: /\bblack\b/ },
  { name: 'Blue', pattern: /\bblue\b|\bnavy\b|\bglacier\b|\briptide\b|\bcascade\b/ },
  { name: 'Brown', pattern: /\bbrown\b|\bcaramel\b|\bchestnut\b|\bclay\b|\blatte\b|\bmocha\b|\btortoise\b|\bwood\b|\brosewood\b|\bdune\b/ },
  { name: 'Green', pattern: /\bgreen\b|\bsage\b|\bpine\b|\bolive\b|\blime\b|\bcamo\b|\bwoodland\b/ },
  { name: 'Gray', pattern: /\bgrey\b|\bgray\b|\bstone\b|\bflannel\b|\blunar\b|\bheather\b|\bsilver\b/ },
  { name: 'Orange', pattern: /\borange\b|\bspice\b|\bautumn\b/ },
  { name: 'Pink', pattern: /\bpink\b|\brose\b|\bpetal\b|\bberry\b|\bblush\b|\bmagenta\b|\bprimrose\b|\bsweet pea\b|\bballerina\b|\btulip\b|\bpixie\b|\bmagnolia\b|\bpeach\b|\bsalmon\b|\bwildrose\b|\bdaydream\b|\bdaisy\b|\bflutter\b|\bpillow talk\b|\brazzle\b|\bpunch\b/ },
  { name: 'Purple', pattern: /\bpurple\b|\blavender\b|\blilac\b|\borchid\b|\bviolet\b|\bplum\b|\bgrape\b|\bamethyst\b/ },
  { name: 'Red', pattern: /\bred\b|\bcrimson\b|\bcherry\b|\bfruit punch\b|\bharvest berry\b|\bamericana\b|\bmerlot\b/ },
  { name: 'White', pattern: /\bwhite\b|\bcream\b|\blinen\b|\bivory\b/ },
  { name: 'Yellow', pattern: /\byellow\b|\blemon\b|\bbutter\b|\bbanana\b|\bsunshine\b|\bmarigold\b/ }
]

function getProductColorSourceNames(product: ProductColorSource): string[] {
  if (product.category === 'HydroJug') {
    const titleColor = product.title.match(/^HydroJug\s+(.+?)\s+-\s+/)?.[1]
    if (titleColor && !/straws?|lids?|boots?|keychain|accessor/i.test(titleColor)) return [titleColor]
  }

  const colors = (product.colors || []).filter(color => color.trim() && color.toLowerCase() !== 'assorted')
  return colors.length ? colors : [product.title]
}

export function getProductColorNames(product: ProductColorSource): string[] {
  const sourceColors = getProductColorSourceNames(product)
  const colorText = sourceColors.join(' ').toLowerCase()
  if (!colorText) return []

  const matchedColors = normalColors
    .filter(color => color.pattern.test(colorText))
    .map(color => color.name)

  return matchedColors.length > 0 ? matchedColors : ['Multicolor']
}

export function hasFeminineColor(product: ProductColorSource): boolean {
  const colorText = [...getProductColorSourceNames(product), product.title].join(' ').toLowerCase()
  return feminineColorTerms.some(term => colorText.includes(term))
}

export function compareHydroJugFirst(
  first: ProductColorSource,
  second: ProductColorSource
): number {
  const brandOrder = Number(second.category === 'HydroJug') - Number(first.category === 'HydroJug')
  if (brandOrder !== 0) return brandOrder
  if (first.category !== 'HydroJug') return 0
  return Number(hasFeminineColor(second)) - Number(hasFeminineColor(first))
}
