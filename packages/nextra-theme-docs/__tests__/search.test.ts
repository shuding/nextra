describe('search', () => {
  it('should match structurizeData snapshot', async () => {
    const nextraDataEnglish = await import(
      '../../../examples/swr-site/.next/static/chunks/nextra-data-en.json'
    )
    expect(nextraDataEnglish.default).toMatchSnapshot()
  })
})
