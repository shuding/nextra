describe('search', () => {
  it('should match structurizeData snapshot', async () => {
    const data = await import('../../../examples/swr-site/.next/static/chunks/nextra-data-en.json')
    expect(data).toMatchSnapshot()
  })
})
