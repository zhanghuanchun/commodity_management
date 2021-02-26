import React, { Component } from 'react'
import { EditorState, convertToRaw,ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import './css/rich_text_editor.less'
export default class RichTextEditor extends Component {
  state = {
    editorState: EditorState.createEmpty(),
  }

  // 自定义方法，便于add_updata组件能拿到用户所输入的商品详情信息的Html文本
  getRichText = () =>
    draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))

  setRichText = (html)=>{
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      this.setState({
        editorState,
      });
    }
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    })
  }

  render() {
    const { editorState } = this.state
    return (
      <div style={{ marginLeft: '13px' }}>
        <Editor
          editorState={editorState}
          //   wrapperClassName="demo-wrapper"
          //   editorClassName="demo-editor"  // 用户编辑框的样式
          editorStyle={{
            border: ' 1px solid #13c2c2',
            paddingLeft: '10px',
            lineHeight: '10px',
            minHeight: '200px',
          }}
          onEditorStateChange={this.onEditorStateChange}
        />
      </div>
    )
  }
}
