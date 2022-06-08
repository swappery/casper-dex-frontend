export type PageMeta = {
  title: string
  description?: string
  image?: string
}
export const DEFAULT_META: PageMeta = {
  title: 'Swappery',
}

export const getCustomMeta = (path: string): PageMeta => {
  let basePath
  if (path.startsWith('/swap')) {
    basePath = '/swap'
  } else if (path.startsWith('/add')) {
    basePath = '/add'
  } else if (path.startsWith('/remove')) {
    basePath = '/remove'
  } else if (path.startsWith('/find')) {
    basePath = '/find'
  } else {
    basePath = path
  }

  switch (basePath) {
    case '/':
      return {
        title: "Home')} | Swappery",
      }
    case '/swap':
      return {
        title: "Exchange | Swappery",
      }
    case '/add':
      return {
        title: "Add Liquidity | Swappery",
      }
    case '/remove':
      return {
        title: "Remove Liquidity | Swappery",
      }
    case '/liquidity':
      return {
        title: "Liquidity | Swappery",
      }
    case '/find':
      return {
        title: "Import Pool | Swappery",
      }
    case '/farm':
      return {
        title: "Farm | Swappery",
      }
    default:
      return {title: ""}
  }
}

