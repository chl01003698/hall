// gray.frag.js
module.exports =
`
#ifdef GL_ES
precision lowp float;
#endif

varying vec4 v_fragmentColor;
varying vec2 v_texCoord;
//uniform sampler2D CC_Texture0;
void main()
{
    vec4 v_orColor = v_fragmentColor * texture2D(CC_Texture0, v_texCoord);
    float gray = dot(v_orColor.rgb, vec3(0.8, 0.9, 0.85));
    gl_FragColor = vec4(v_orColor.r, v_orColor.g, v_orColor.b, v_orColor.a);
}
`