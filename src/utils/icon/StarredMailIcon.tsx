import * as React from 'react';

const StarredMailIcon = ({ style }: { style?: React.CSSProperties }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={style?.width ?? 25} viewBox="0 0 25 25" height={style?.height ?? 25} fill="none">
    <path fill="url(#a)" d="M0 0h25v25H0z" />
    <defs>
      <pattern id="a" width={1} height={1} patternContentUnits="objectBoundingBox">
        <use xlinkHref="#b" transform="scale(.02)" />
      </pattern>
      <image
        xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFJ0lEQVR4nO1ZS2yUVRT+i+ALFd8LjXHlxkfUqIlrExPdKTrW0MGh0//77kzrLEqIDwT/oCgqjbrSjQ1YQTRUQnxG0YpEAUuJK1ESXCASwQcixrjwUXPineb0+v/z3zudqS7mJCedds4595x77nk2ijrQgQ7MGlQqlQtJFgA8RnKU5A6Sey3uALBZvjPG3Nnb23tB9H+CUql0NoB7AXxK8i+Sk54otLtJDoiM/9QAkmsA/BygfCqKDPFUabYNIlkEcDRDsYMkN5BcHsdxTxzHt1vskb/Z7w5mGPQtyUVtN6C/v/8Mq4irxHfiHWPM5b6y4ji+AsATJL9PkTdSLBbntzOQJ1KexDKSpzcrVxQGcB/JE47sPS1PCGIEgC+dg94rl8sXteoMY8zFAN53PPNFy4yxz2maJ0g+niTJnKjFkCTJHJJPOmeNt+SZAXjJ8cSyqM1A8n7HmPUzEmgzzTRPNCHjOsFQPpJrnQu8O5pBnTiiYyL0OZHstoVPsDuEt1AonERyzEnNC4INkdtXN3IiNLBJzgPwlVJEPs8LkVGtVi8B8IvSY3Uz3jg+k7gg2ZtSH3pD5QB4UPEfD/KK9D/KiB8kczXxLPanGHIgSZK5IbKKxeJ8p2hWQwzZrRjXRIEAYLG6iN8F1e+Lm5D3lOLf6cUkBUh3sdJK+PANDAycF8fxjcaYe+Tmdeq0OOUVoRFa4fGRTfIqZcifJM/PZZJZQTeAOZX4eWnfARzLaCD/MMZcJiifMxrFY3YEeK5RQiF5SPHc4WP9anXQhgZ0Ix4t+rCiH/Zo51/MOg/Ay4ru0VxDZIpTDA81oHsm7XalpSC5keRS3VrYoF1qvxvP8OLTDS5upaJ71ceQj3wC0yo2VbAs/WafWmFrzNSFWRxr1FORLCna7bmGkPxMMdzWiLZWq51C8g1HoTdLpdKpWTyFQuFkklscnncHBwdPy9FroaLf62PIREhQidKivKPYugby14cYXgeZMoMM0TOBMaYvl8HeMoCt6gKOZtHaabJOt1V4fc5gE09rk2JYEXlCHMdLFN94A/njqkYt8ZUP4GF1Aa/4GLJcKTTqexDJIfdpxXF8E4C3BOWzpVun6IYC5G9SfI/kMgC4VVn+dRRFXT4HAXhH8ckwti0lvW7Tg5rw+BoC4BslZ2EuQ7lcPpPkb4rpep+DdOUNwEM+so0xV+sWxbe1iZyUOuTZ9mcpO+bWG40+SzlOnxY/iXxBxsqQGaBSqVybouS4MebmOo181oGuAv4ajxfyo+KpeBsiM4OzDXygEX2tVjtL4snS7rNvOC22umxh21ePQVG0kWxOb01+Ch53ST6rBGzJo5fhS25Xhqo8WqER2ryBrVwuX0ryV6XHqigU5C36eqQdkPyz4/pgRsuHarV6jp7qJAaiWQb8u7suBAtxhqsjvrWkVcDpRVm88UJTgoRRCRqJZgmSJJmb4oldeZ1xJqgMJOmxJ5oFsIG93fHE597FzwVZNugqmrIN75KMY/ezo/bnghkYIHVihZOdJsUTTRshYMfRuiF71GZlkczUNnu4xU+K5hCAG3zPsW3HWqfYTdZjounnVAfpVLVrxRi7gvHunwC8ZgtZLMOZoJ0nVtou9nAG7+GmslOGITs9lJXVzi5bNFP/HxiIUrFX5VX5IJCVZNphto0ejuP4rr6+vnOddqYbwOtO19wQxcsAPpbeSVqcqA3QJcLtIW/LArtSqVwZ8N+tW+zieaOdSWQHMAHgQ1njyFAk87e+jA50oANR2+FvwVgLnb/xj7YAAAAASUVORK5CYII="
        id="b"
        width={50}
        height={50}
      />
    </defs>
  </svg>
);
export default StarredMailIcon;
