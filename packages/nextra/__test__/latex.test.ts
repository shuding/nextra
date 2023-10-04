import { compileMdx } from '../src/compile'

const options = {
  mdxOptions: { jsx: true },
  latex: true
}

describe('latex', () => {
  it("should not throw TypeError: Cannot read properties of undefined (reading 'mathFlowInside')", async () => {
    const { result } = await compileMdx(
      `$$
z_i = \\begin{cases}\\lambda_i\\cdot s_i\\cdot c + d_i + (e_i\\cdot\\rho_i) \\mod Q, \\hspace{2em} \\text{if } r_y \\text{ even} \\\\ \\lambda_i\\cdot s_i\\cdot c - d_i - (e_i\\cdot\\rho_i) \\mod Q, \\hspace{2em} \\text{if } r_y \\text{ odd}\\end{cases}
$$`,
      options
    )
    expect(result).toMatchInlineSnapshot(`
      "/*@jsxRuntime automatic @jsxImportSource react*/
      const {useMDXComponents: _provideComponents} = arguments[0];
      function _createMdxContent(props) {
        const _components = Object.assign({
          span: \\"span\\",
          math: \\"math\\",
          semantics: \\"semantics\\",
          mrow: \\"mrow\\",
          msub: \\"msub\\",
          mi: \\"mi\\",
          mo: \\"mo\\",
          mtable: \\"mtable\\",
          mtr: \\"mtr\\",
          mtd: \\"mtd\\",
          mstyle: \\"mstyle\\",
          mspace: \\"mspace\\",
          mtext: \\"mtext\\",
          annotation: \\"annotation\\"
        }, _provideComponents(), props.components);
        return <_components.span className=\\"katex-display\\"><_components.span className=\\"katex\\"><_components.span className=\\"katex-mathml\\"><_components.math xmlns=\\"http://www.w3.org/1998/Math/MathML\\" display=\\"block\\"><_components.semantics><_components.mrow><_components.msub><_components.mi>{\\"z\\"}</_components.mi><_components.mi>{\\"i\\"}</_components.mi></_components.msub><_components.mo>{\\"=\\"}</_components.mo><_components.mrow><_components.mo fence=\\"true\\">{\\"{\\"}</_components.mo><_components.mtable rowspacing=\\"0.36em\\" columnalign=\\"left left\\" columnspacing=\\"1em\\"><_components.mtr><_components.mtd><_components.mstyle scriptlevel=\\"0\\" displaystyle=\\"false\\"><_components.mrow><_components.msub><_components.mi>{\\"λ\\"}</_components.mi><_components.mi>{\\"i\\"}</_components.mi></_components.msub><_components.mo>{\\"⋅\\"}</_components.mo><_components.msub><_components.mi>{\\"s\\"}</_components.mi><_components.mi>{\\"i\\"}</_components.mi></_components.msub><_components.mo>{\\"⋅\\"}</_components.mo><_components.mi>{\\"c\\"}</_components.mi><_components.mo>{\\"+\\"}</_components.mo><_components.msub><_components.mi>{\\"d\\"}</_components.mi><_components.mi>{\\"i\\"}</_components.mi></_components.msub><_components.mo>{\\"+\\"}</_components.mo><_components.mo stretchy=\\"false\\">{\\"(\\"}</_components.mo><_components.msub><_components.mi>{\\"e\\"}</_components.mi><_components.mi>{\\"i\\"}</_components.mi></_components.msub><_components.mo>{\\"⋅\\"}</_components.mo><_components.msub><_components.mi>{\\"ρ\\"}</_components.mi><_components.mi>{\\"i\\"}</_components.mi></_components.msub><_components.mo stretchy=\\"false\\">{\\")\\"}</_components.mo><_components.mspace /><_components.mspace width=\\"0.6667em\\" /><_components.mrow><_components.mi mathvariant=\\"normal\\">{\\"m\\"}</_components.mi><_components.mi mathvariant=\\"normal\\">{\\"o\\"}</_components.mi><_components.mi mathvariant=\\"normal\\">{\\"d\\"}</_components.mi></_components.mrow><_components.mtext>{\\" \\"}</_components.mtext><_components.mtext>{\\" \\"}</_components.mtext><_components.mi>{\\"Q\\"}</_components.mi><_components.mo separator=\\"true\\">{\\",\\"}</_components.mo><_components.mspace width=\\"2em\\" /><_components.mtext>{\\"if \\"}</_components.mtext><_components.msub><_components.mi>{\\"r\\"}</_components.mi><_components.mi>{\\"y\\"}</_components.mi></_components.msub><_components.mtext>{\\" even\\"}</_components.mtext></_components.mrow></_components.mstyle></_components.mtd></_components.mtr><_components.mtr><_components.mtd><_components.mstyle scriptlevel=\\"0\\" displaystyle=\\"false\\"><_components.mrow><_components.msub><_components.mi>{\\"λ\\"}</_components.mi><_components.mi>{\\"i\\"}</_components.mi></_components.msub><_components.mo>{\\"⋅\\"}</_components.mo><_components.msub><_components.mi>{\\"s\\"}</_components.mi><_components.mi>{\\"i\\"}</_components.mi></_components.msub><_components.mo>{\\"⋅\\"}</_components.mo><_components.mi>{\\"c\\"}</_components.mi><_components.mo>{\\"−\\"}</_components.mo><_components.msub><_components.mi>{\\"d\\"}</_components.mi><_components.mi>{\\"i\\"}</_components.mi></_components.msub><_components.mo>{\\"−\\"}</_components.mo><_components.mo stretchy=\\"false\\">{\\"(\\"}</_components.mo><_components.msub><_components.mi>{\\"e\\"}</_components.mi><_components.mi>{\\"i\\"}</_components.mi></_components.msub><_components.mo>{\\"⋅\\"}</_components.mo><_components.msub><_components.mi>{\\"ρ\\"}</_components.mi><_components.mi>{\\"i\\"}</_components.mi></_components.msub><_components.mo stretchy=\\"false\\">{\\")\\"}</_components.mo><_components.mspace /><_components.mspace width=\\"0.6667em\\" /><_components.mrow><_components.mi mathvariant=\\"normal\\">{\\"m\\"}</_components.mi><_components.mi mathvariant=\\"normal\\">{\\"o\\"}</_components.mi><_components.mi mathvariant=\\"normal\\">{\\"d\\"}</_components.mi></_components.mrow><_components.mtext>{\\" \\"}</_components.mtext><_components.mtext>{\\" \\"}</_components.mtext><_components.mi>{\\"Q\\"}</_components.mi><_components.mo separator=\\"true\\">{\\",\\"}</_components.mo><_components.mspace width=\\"2em\\" /><_components.mtext>{\\"if \\"}</_components.mtext><_components.msub><_components.mi>{\\"r\\"}</_components.mi><_components.mi>{\\"y\\"}</_components.mi></_components.msub><_components.mtext>{\\" odd\\"}</_components.mtext></_components.mrow></_components.mstyle></_components.mtd></_components.mtr></_components.mtable></_components.mrow></_components.mrow><_components.annotation encoding=\\"application/x-tex\\">{\\"z_i = \\\\\\\\begin{cases}\\\\\\\\lambda_i\\\\\\\\cdot s_i\\\\\\\\cdot c + d_i + (e_i\\\\\\\\cdot\\\\\\\\rho_i) \\\\\\\\mod Q, \\\\\\\\hspace{2em} \\\\\\\\text{if } r_y \\\\\\\\text{ even} \\\\\\\\\\\\\\\\ \\\\\\\\lambda_i\\\\\\\\cdot s_i\\\\\\\\cdot c - d_i - (e_i\\\\\\\\cdot\\\\\\\\rho_i) \\\\\\\\mod Q, \\\\\\\\hspace{2em} \\\\\\\\text{if } r_y \\\\\\\\text{ odd}\\\\\\\\end{cases}\\"}</_components.annotation></_components.semantics></_components.math></_components.span><_components.span className=\\"katex-html\\" aria-hidden=\\"true\\"><_components.span className=\\"base\\"><_components.span className=\\"strut\\" style={{
          height: \\"0.5806em\\",
          verticalAlign: \\"-0.15em\\"
        }} /><_components.span className=\\"mord\\"><_components.span className=\\"mord mathnormal\\" style={{
          marginRight: \\"0.04398em\\"
        }}>{\\"z\\"}</_components.span><_components.span className=\\"msupsub\\"><_components.span className=\\"vlist-t vlist-t2\\"><_components.span className=\\"vlist-r\\"><_components.span className=\\"vlist\\" style={{
          height: \\"0.3117em\\"
        }}><_components.span style={{
          top: \\"-2.55em\\",
          marginLeft: \\"-0.044em\\",
          marginRight: \\"0.05em\\"
        }}><_components.span className=\\"pstrut\\" style={{
          height: \\"2.7em\\"
        }} /><_components.span className=\\"sizing reset-size6 size3 mtight\\"><_components.span className=\\"mord mathnormal mtight\\">{\\"i\\"}</_components.span></_components.span></_components.span></_components.span><_components.span className=\\"vlist-s\\">{\\"​\\"}</_components.span></_components.span><_components.span className=\\"vlist-r\\"><_components.span className=\\"vlist\\" style={{
          height: \\"0.15em\\"
        }}><_components.span /></_components.span></_components.span></_components.span></_components.span></_components.span><_components.span className=\\"mspace\\" style={{
          marginRight: \\"0.2778em\\"
        }} /><_components.span className=\\"mrel\\">{\\"=\\"}</_components.span><_components.span className=\\"mspace\\" style={{
          marginRight: \\"0.2778em\\"
        }} /></_components.span><_components.span className=\\"base\\"><_components.span className=\\"strut\\" style={{
          height: \\"3em\\",
          verticalAlign: \\"-1.25em\\"
        }} /><_components.span className=\\"minner\\"><_components.span className=\\"mopen delimcenter\\" style={{
          top: \\"0em\\"
        }}><_components.span className=\\"delimsizing size4\\">{\\"{\\"}</_components.span></_components.span><_components.span className=\\"mord\\"><_components.span className=\\"mtable\\"><_components.span className=\\"col-align-l\\"><_components.span className=\\"vlist-t vlist-t2\\"><_components.span className=\\"vlist-r\\"><_components.span className=\\"vlist\\" style={{
          height: \\"1.69em\\"
        }}><_components.span style={{
          top: \\"-3.69em\\"
        }}><_components.span className=\\"pstrut\\" style={{
          height: \\"3.008em\\"
        }} /><_components.span className=\\"mord\\"><_components.span className=\\"mord\\"><_components.span className=\\"mord mathnormal\\">{\\"λ\\"}</_components.span><_components.span className=\\"msupsub\\"><_components.span className=\\"vlist-t vlist-t2\\"><_components.span className=\\"vlist-r\\"><_components.span className=\\"vlist\\" style={{
          height: \\"0.3117em\\"
        }}><_components.span style={{
          top: \\"-2.55em\\",
          marginLeft: \\"0em\\",
          marginRight: \\"0.05em\\"
        }}><_components.span className=\\"pstrut\\" style={{
          height: \\"2.7em\\"
        }} /><_components.span className=\\"sizing reset-size6 size3 mtight\\"><_components.span className=\\"mord mathnormal mtight\\">{\\"i\\"}</_components.span></_components.span></_components.span></_components.span><_components.span className=\\"vlist-s\\">{\\"​\\"}</_components.span></_components.span><_components.span className=\\"vlist-r\\"><_components.span className=\\"vlist\\" style={{
          height: \\"0.15em\\"
        }}><_components.span /></_components.span></_components.span></_components.span></_components.span></_components.span><_components.span className=\\"mspace\\" style={{
          marginRight: \\"0.2222em\\"
        }} /><_components.span className=\\"mbin\\">{\\"⋅\\"}</_components.span><_components.span className=\\"mspace\\" style={{
          marginRight: \\"0.2222em\\"
        }} /><_components.span className=\\"mord\\"><_components.span className=\\"mord mathnormal\\">{\\"s\\"}</_components.span><_components.span className=\\"msupsub\\"><_components.span className=\\"vlist-t vlist-t2\\"><_components.span className=\\"vlist-r\\"><_components.span className=\\"vlist\\" style={{
          height: \\"0.3117em\\"
        }}><_components.span style={{
          top: \\"-2.55em\\",
          marginLeft: \\"0em\\",
          marginRight: \\"0.05em\\"
        }}><_components.span className=\\"pstrut\\" style={{
          height: \\"2.7em\\"
        }} /><_components.span className=\\"sizing reset-size6 size3 mtight\\"><_components.span className=\\"mord mathnormal mtight\\">{\\"i\\"}</_components.span></_components.span></_components.span></_components.span><_components.span className=\\"vlist-s\\">{\\"​\\"}</_components.span></_components.span><_components.span className=\\"vlist-r\\"><_components.span className=\\"vlist\\" style={{
          height: \\"0.15em\\"
        }}><_components.span /></_components.span></_components.span></_components.span></_components.span></_components.span><_components.span className=\\"mspace\\" style={{
          marginRight: \\"0.2222em\\"
        }} /><_components.span className=\\"mbin\\">{\\"⋅\\"}</_components.span><_components.span className=\\"mspace\\" style={{
          marginRight: \\"0.2222em\\"
        }} /><_components.span className=\\"mord mathnormal\\">{\\"c\\"}</_components.span><_components.span className=\\"mspace\\" style={{
          marginRight: \\"0.2222em\\"
        }} /><_components.span className=\\"mbin\\">{\\"+\\"}</_components.span><_components.span className=\\"mspace\\" style={{
          marginRight: \\"0.2222em\\"
        }} /><_components.span className=\\"mord\\"><_components.span className=\\"mord mathnormal\\">{\\"d\\"}</_components.span><_components.span className=\\"msupsub\\"><_components.span className=\\"vlist-t vlist-t2\\"><_components.span className=\\"vlist-r\\"><_components.span className=\\"vlist\\" style={{
          height: \\"0.3117em\\"
        }}><_components.span style={{
          top: \\"-2.55em\\",
          marginLeft: \\"0em\\",
          marginRight: \\"0.05em\\"
        }}><_components.span className=\\"pstrut\\" style={{
          height: \\"2.7em\\"
        }} /><_components.span className=\\"sizing reset-size6 size3 mtight\\"><_components.span className=\\"mord mathnormal mtight\\">{\\"i\\"}</_components.span></_components.span></_components.span></_components.span><_components.span className=\\"vlist-s\\">{\\"​\\"}</_components.span></_components.span><_components.span className=\\"vlist-r\\"><_components.span className=\\"vlist\\" style={{
          height: \\"0.15em\\"
        }}><_components.span /></_components.span></_components.span></_components.span></_components.span></_components.span><_components.span className=\\"mspace\\" style={{
          marginRight: \\"0.2222em\\"
        }} /><_components.span className=\\"mbin\\">{\\"+\\"}</_components.span><_components.span className=\\"mspace\\" style={{
          marginRight: \\"0.2222em\\"
        }} /><_components.span className=\\"mopen\\">{\\"(\\"}</_components.span><_components.span className=\\"mord\\"><_components.span className=\\"mord mathnormal\\">{\\"e\\"}</_components.span><_components.span className=\\"msupsub\\"><_components.span className=\\"vlist-t vlist-t2\\"><_components.span className=\\"vlist-r\\"><_components.span className=\\"vlist\\" style={{
          height: \\"0.3117em\\"
        }}><_components.span style={{
          top: \\"-2.55em\\",
          marginLeft: \\"0em\\",
          marginRight: \\"0.05em\\"
        }}><_components.span className=\\"pstrut\\" style={{
          height: \\"2.7em\\"
        }} /><_components.span className=\\"sizing reset-size6 size3 mtight\\"><_components.span className=\\"mord mathnormal mtight\\">{\\"i\\"}</_components.span></_components.span></_components.span></_components.span><_components.span className=\\"vlist-s\\">{\\"​\\"}</_components.span></_components.span><_components.span className=\\"vlist-r\\"><_components.span className=\\"vlist\\" style={{
          height: \\"0.15em\\"
        }}><_components.span /></_components.span></_components.span></_components.span></_components.span></_components.span><_components.span className=\\"mspace\\" style={{
          marginRight: \\"0.2222em\\"
        }} /><_components.span className=\\"mbin\\">{\\"⋅\\"}</_components.span><_components.span className=\\"mspace\\" style={{
          marginRight: \\"0.2222em\\"
        }} /><_components.span className=\\"mord\\"><_components.span className=\\"mord mathnormal\\">{\\"ρ\\"}</_components.span><_components.span className=\\"msupsub\\"><_components.span className=\\"vlist-t vlist-t2\\"><_components.span className=\\"vlist-r\\"><_components.span className=\\"vlist\\" style={{
          height: \\"0.3117em\\"
        }}><_components.span style={{
          top: \\"-2.55em\\",
          marginLeft: \\"0em\\",
          marginRight: \\"0.05em\\"
        }}><_components.span className=\\"pstrut\\" style={{
          height: \\"2.7em\\"
        }} /><_components.span className=\\"sizing reset-size6 size3 mtight\\"><_components.span className=\\"mord mathnormal mtight\\">{\\"i\\"}</_components.span></_components.span></_components.span></_components.span><_components.span className=\\"vlist-s\\">{\\"​\\"}</_components.span></_components.span><_components.span className=\\"vlist-r\\"><_components.span className=\\"vlist\\" style={{
          height: \\"0.15em\\"
        }}><_components.span /></_components.span></_components.span></_components.span></_components.span></_components.span><_components.span className=\\"mclose\\">{\\")\\"}</_components.span><_components.span className=\\"mspace allowbreak\\" /><_components.span className=\\"mspace\\" style={{
          marginRight: \\"0.6667em\\"
        }} /><_components.span className=\\"mord\\"><_components.span className=\\"mord\\"><_components.span className=\\"mord mathrm\\">{\\"mod\\"}</_components.span></_components.span></_components.span><_components.span className=\\"mspace\\" style={{
          marginRight: \\"0.1667em\\"
        }} /><_components.span className=\\"mspace\\" style={{
          marginRight: \\"0.1667em\\"
        }} /><_components.span className=\\"mord mathnormal\\">{\\"Q\\"}</_components.span><_components.span className=\\"mpunct\\">{\\",\\"}</_components.span><_components.span className=\\"mspace\\" style={{
          marginRight: \\"2em\\"
        }} /><_components.span className=\\"mspace\\" style={{
          marginRight: \\"0.1667em\\"
        }} /><_components.span className=\\"mord text\\"><_components.span className=\\"mord\\">{\\"if \\"}</_components.span></_components.span><_components.span className=\\"mord\\"><_components.span className=\\"mord mathnormal\\" style={{
          marginRight: \\"0.02778em\\"
        }}>{\\"r\\"}</_components.span><_components.span className=\\"msupsub\\"><_components.span className=\\"vlist-t vlist-t2\\"><_components.span className=\\"vlist-r\\"><_components.span className=\\"vlist\\" style={{
          height: \\"0.1514em\\"
        }}><_components.span style={{
          top: \\"-2.55em\\",
          marginLeft: \\"-0.0278em\\",
          marginRight: \\"0.05em\\"
        }}><_components.span className=\\"pstrut\\" style={{
          height: \\"2.7em\\"
        }} /><_components.span className=\\"sizing reset-size6 size3 mtight\\"><_components.span className=\\"mord mathnormal mtight\\" style={{
          marginRight: \\"0.03588em\\"
        }}>{\\"y\\"}</_components.span></_components.span></_components.span></_components.span><_components.span className=\\"vlist-s\\">{\\"​\\"}</_components.span></_components.span><_components.span className=\\"vlist-r\\"><_components.span className=\\"vlist\\" style={{
          height: \\"0.2861em\\"
        }}><_components.span /></_components.span></_components.span></_components.span></_components.span></_components.span><_components.span className=\\"mord text\\"><_components.span className=\\"mord\\">{\\" even\\"}</_components.span></_components.span></_components.span></_components.span><_components.span style={{
          top: \\"-2.25em\\"
        }}><_components.span className=\\"pstrut\\" style={{
          height: \\"3.008em\\"
        }} /><_components.span className=\\"mord\\"><_components.span className=\\"mord\\"><_components.span className=\\"mord mathnormal\\">{\\"λ\\"}</_components.span><_components.span className=\\"msupsub\\"><_components.span className=\\"vlist-t vlist-t2\\"><_components.span className=\\"vlist-r\\"><_components.span className=\\"vlist\\" style={{
          height: \\"0.3117em\\"
        }}><_components.span style={{
          top: \\"-2.55em\\",
          marginLeft: \\"0em\\",
          marginRight: \\"0.05em\\"
        }}><_components.span className=\\"pstrut\\" style={{
          height: \\"2.7em\\"
        }} /><_components.span className=\\"sizing reset-size6 size3 mtight\\"><_components.span className=\\"mord mathnormal mtight\\">{\\"i\\"}</_components.span></_components.span></_components.span></_components.span><_components.span className=\\"vlist-s\\">{\\"​\\"}</_components.span></_components.span><_components.span className=\\"vlist-r\\"><_components.span className=\\"vlist\\" style={{
          height: \\"0.15em\\"
        }}><_components.span /></_components.span></_components.span></_components.span></_components.span></_components.span><_components.span className=\\"mspace\\" style={{
          marginRight: \\"0.2222em\\"
        }} /><_components.span className=\\"mbin\\">{\\"⋅\\"}</_components.span><_components.span className=\\"mspace\\" style={{
          marginRight: \\"0.2222em\\"
        }} /><_components.span className=\\"mord\\"><_components.span className=\\"mord mathnormal\\">{\\"s\\"}</_components.span><_components.span className=\\"msupsub\\"><_components.span className=\\"vlist-t vlist-t2\\"><_components.span className=\\"vlist-r\\"><_components.span className=\\"vlist\\" style={{
          height: \\"0.3117em\\"
        }}><_components.span style={{
          top: \\"-2.55em\\",
          marginLeft: \\"0em\\",
          marginRight: \\"0.05em\\"
        }}><_components.span className=\\"pstrut\\" style={{
          height: \\"2.7em\\"
        }} /><_components.span className=\\"sizing reset-size6 size3 mtight\\"><_components.span className=\\"mord mathnormal mtight\\">{\\"i\\"}</_components.span></_components.span></_components.span></_components.span><_components.span className=\\"vlist-s\\">{\\"​\\"}</_components.span></_components.span><_components.span className=\\"vlist-r\\"><_components.span className=\\"vlist\\" style={{
          height: \\"0.15em\\"
        }}><_components.span /></_components.span></_components.span></_components.span></_components.span></_components.span><_components.span className=\\"mspace\\" style={{
          marginRight: \\"0.2222em\\"
        }} /><_components.span className=\\"mbin\\">{\\"⋅\\"}</_components.span><_components.span className=\\"mspace\\" style={{
          marginRight: \\"0.2222em\\"
        }} /><_components.span className=\\"mord mathnormal\\">{\\"c\\"}</_components.span><_components.span className=\\"mspace\\" style={{
          marginRight: \\"0.2222em\\"
        }} /><_components.span className=\\"mbin\\">{\\"−\\"}</_components.span><_components.span className=\\"mspace\\" style={{
          marginRight: \\"0.2222em\\"
        }} /><_components.span className=\\"mord\\"><_components.span className=\\"mord mathnormal\\">{\\"d\\"}</_components.span><_components.span className=\\"msupsub\\"><_components.span className=\\"vlist-t vlist-t2\\"><_components.span className=\\"vlist-r\\"><_components.span className=\\"vlist\\" style={{
          height: \\"0.3117em\\"
        }}><_components.span style={{
          top: \\"-2.55em\\",
          marginLeft: \\"0em\\",
          marginRight: \\"0.05em\\"
        }}><_components.span className=\\"pstrut\\" style={{
          height: \\"2.7em\\"
        }} /><_components.span className=\\"sizing reset-size6 size3 mtight\\"><_components.span className=\\"mord mathnormal mtight\\">{\\"i\\"}</_components.span></_components.span></_components.span></_components.span><_components.span className=\\"vlist-s\\">{\\"​\\"}</_components.span></_components.span><_components.span className=\\"vlist-r\\"><_components.span className=\\"vlist\\" style={{
          height: \\"0.15em\\"
        }}><_components.span /></_components.span></_components.span></_components.span></_components.span></_components.span><_components.span className=\\"mspace\\" style={{
          marginRight: \\"0.2222em\\"
        }} /><_components.span className=\\"mbin\\">{\\"−\\"}</_components.span><_components.span className=\\"mspace\\" style={{
          marginRight: \\"0.2222em\\"
        }} /><_components.span className=\\"mopen\\">{\\"(\\"}</_components.span><_components.span className=\\"mord\\"><_components.span className=\\"mord mathnormal\\">{\\"e\\"}</_components.span><_components.span className=\\"msupsub\\"><_components.span className=\\"vlist-t vlist-t2\\"><_components.span className=\\"vlist-r\\"><_components.span className=\\"vlist\\" style={{
          height: \\"0.3117em\\"
        }}><_components.span style={{
          top: \\"-2.55em\\",
          marginLeft: \\"0em\\",
          marginRight: \\"0.05em\\"
        }}><_components.span className=\\"pstrut\\" style={{
          height: \\"2.7em\\"
        }} /><_components.span className=\\"sizing reset-size6 size3 mtight\\"><_components.span className=\\"mord mathnormal mtight\\">{\\"i\\"}</_components.span></_components.span></_components.span></_components.span><_components.span className=\\"vlist-s\\">{\\"​\\"}</_components.span></_components.span><_components.span className=\\"vlist-r\\"><_components.span className=\\"vlist\\" style={{
          height: \\"0.15em\\"
        }}><_components.span /></_components.span></_components.span></_components.span></_components.span></_components.span><_components.span className=\\"mspace\\" style={{
          marginRight: \\"0.2222em\\"
        }} /><_components.span className=\\"mbin\\">{\\"⋅\\"}</_components.span><_components.span className=\\"mspace\\" style={{
          marginRight: \\"0.2222em\\"
        }} /><_components.span className=\\"mord\\"><_components.span className=\\"mord mathnormal\\">{\\"ρ\\"}</_components.span><_components.span className=\\"msupsub\\"><_components.span className=\\"vlist-t vlist-t2\\"><_components.span className=\\"vlist-r\\"><_components.span className=\\"vlist\\" style={{
          height: \\"0.3117em\\"
        }}><_components.span style={{
          top: \\"-2.55em\\",
          marginLeft: \\"0em\\",
          marginRight: \\"0.05em\\"
        }}><_components.span className=\\"pstrut\\" style={{
          height: \\"2.7em\\"
        }} /><_components.span className=\\"sizing reset-size6 size3 mtight\\"><_components.span className=\\"mord mathnormal mtight\\">{\\"i\\"}</_components.span></_components.span></_components.span></_components.span><_components.span className=\\"vlist-s\\">{\\"​\\"}</_components.span></_components.span><_components.span className=\\"vlist-r\\"><_components.span className=\\"vlist\\" style={{
          height: \\"0.15em\\"
        }}><_components.span /></_components.span></_components.span></_components.span></_components.span></_components.span><_components.span className=\\"mclose\\">{\\")\\"}</_components.span><_components.span className=\\"mspace allowbreak\\" /><_components.span className=\\"mspace\\" style={{
          marginRight: \\"0.6667em\\"
        }} /><_components.span className=\\"mord\\"><_components.span className=\\"mord\\"><_components.span className=\\"mord mathrm\\">{\\"mod\\"}</_components.span></_components.span></_components.span><_components.span className=\\"mspace\\" style={{
          marginRight: \\"0.1667em\\"
        }} /><_components.span className=\\"mspace\\" style={{
          marginRight: \\"0.1667em\\"
        }} /><_components.span className=\\"mord mathnormal\\">{\\"Q\\"}</_components.span><_components.span className=\\"mpunct\\">{\\",\\"}</_components.span><_components.span className=\\"mspace\\" style={{
          marginRight: \\"2em\\"
        }} /><_components.span className=\\"mspace\\" style={{
          marginRight: \\"0.1667em\\"
        }} /><_components.span className=\\"mord text\\"><_components.span className=\\"mord\\">{\\"if \\"}</_components.span></_components.span><_components.span className=\\"mord\\"><_components.span className=\\"mord mathnormal\\" style={{
          marginRight: \\"0.02778em\\"
        }}>{\\"r\\"}</_components.span><_components.span className=\\"msupsub\\"><_components.span className=\\"vlist-t vlist-t2\\"><_components.span className=\\"vlist-r\\"><_components.span className=\\"vlist\\" style={{
          height: \\"0.1514em\\"
        }}><_components.span style={{
          top: \\"-2.55em\\",
          marginLeft: \\"-0.0278em\\",
          marginRight: \\"0.05em\\"
        }}><_components.span className=\\"pstrut\\" style={{
          height: \\"2.7em\\"
        }} /><_components.span className=\\"sizing reset-size6 size3 mtight\\"><_components.span className=\\"mord mathnormal mtight\\" style={{
          marginRight: \\"0.03588em\\"
        }}>{\\"y\\"}</_components.span></_components.span></_components.span></_components.span><_components.span className=\\"vlist-s\\">{\\"​\\"}</_components.span></_components.span><_components.span className=\\"vlist-r\\"><_components.span className=\\"vlist\\" style={{
          height: \\"0.2861em\\"
        }}><_components.span /></_components.span></_components.span></_components.span></_components.span></_components.span><_components.span className=\\"mord text\\"><_components.span className=\\"mord\\">{\\" odd\\"}</_components.span></_components.span></_components.span></_components.span></_components.span><_components.span className=\\"vlist-s\\">{\\"​\\"}</_components.span></_components.span><_components.span className=\\"vlist-r\\"><_components.span className=\\"vlist\\" style={{
          height: \\"1.19em\\"
        }}><_components.span /></_components.span></_components.span></_components.span></_components.span></_components.span></_components.span><_components.span className=\\"mclose nulldelimiter\\" /></_components.span></_components.span></_components.span></_components.span></_components.span>;
      }
      function MDXContent(props = {}) {
        const {wrapper: MDXLayout} = Object.assign({}, _provideComponents(), props.components);
        return MDXLayout ? <MDXLayout {...props}><_createMdxContent {...props} /></MDXLayout> : _createMdxContent(props);
      }
      return {
        default: MDXContent
      };
      "
    `)
  })
})
