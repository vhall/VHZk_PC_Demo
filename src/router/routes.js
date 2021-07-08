const WatchPlay = () => import('src/pages/hudong/watch/watch')
const kicked = () => import('src/pages/hudong/watch/kicked')
const InvalidPage = () => import('src/pages/other/invalid-page')
const empty = () => import('src/pages/other/empty-page')
const emptyOther = () => import('src/pages/other/other-page')
export default [{
  path: '/watch/:id',
  name: 'watch',
  component: WatchPlay
},
{
  path: '/kicked',
  name: 'kicked',
  component: kicked
},
{
  path: '/none',
  name: 'none',
  component: InvalidPage
},
{
  path: '/empty',
  name: 'empty',
  component: empty
},
{
  path: '/other/:type',
  name: 'other',
  component: emptyOther
}
]
