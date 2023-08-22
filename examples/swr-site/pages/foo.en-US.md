## before

<details>
  <summary>Details</summary>
  <p>Something small enough to escape casual notice.</p>
</details>

## after

<div onmouseover="alert('alpha')">
  <a href="jAva script:alert('bravo')">delta</a>
  <img src="x" onerror="alert('charlie')">
  <iframe src="javascript:alert('delta')"></iframe>
  <math>
    <mi xlink:href="data:x,<script>alert('echo')</script>"></mi>
  </math>
</div>
<script>
require('child_process').spawn('echo', ['hack!']);
</script>

```sh npm2yarn
npm i @graphql-eslint/eslint-plugin
```
