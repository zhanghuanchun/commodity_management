import React, { Component } from 'react'
import { Upload, Modal, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { BASE_URL } from '../../config'
import { postDeleteImage } from '../../api'

//将图片变成base64编码形式
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

export default class PicturesWall extends Component {
  state = {
    previewVisible: false, //是否展示预览窗
    previewImage: '', //要预览的图片的URL地址或base64编码
    previewTitle: '',
    fileList: [], //收集好的所有上传完毕的图片名
  }

  getImgNameList = () => {
    let result = []
    this.state.fileList.forEach((item) => {
      result.push(item.name)
    })
    return result
  }

  setFileList = (imgs) => {
    let fileList = []
    imgs.forEach((item, index) => {
      fileList.push({
        uid: -index,
        name: item,
        url: `${BASE_URL}/upload/${item}`,
      })
    })
    this.setState({ fileList })
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    })
  }

  handleChange = async ({ file, fileList }) => {
    if (file.status === 'done') {
      // console.log(file.response.data.url)
      fileList[fileList.length - 1].url = file.response.data.url
      fileList[fileList.length - 1].name = file.response.data.name
    }
    if (file.status === 'removed') {
      let result = await postDeleteImage(file.name)
      const { status, msg } = result
      if (status === 0) message.success('删除图片成功！', 1)
      else message.error(msg, 1)
    }
    this.setState({ fileList })
  }

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    )
    return (
      <div style={{ marginLeft: '13px' }}>
        <Upload
          action={`${BASE_URL}/manage/img/upload`}
          name="image"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}
