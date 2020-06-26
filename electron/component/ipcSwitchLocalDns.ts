import { ipcMain } from 'electron';

import fs from 'fs';

import { exec } from 'child_process'

import dns from 'dns';

import { switchConfig, switchMap } from '../config/swtichConfig';

const dnsPromises = dns.promises;
const fsPromises = fs.promises;

const HOSTPATH = '/etc/hosts';
// const HOSTPATH = '/Users/Allen/Desktop/TEST.txt';

// pre dns 服务ip
const PREDNSSERVICEIP = '182.92.129.95'

// 公用dns 服务ip
const PUBLICDNSSERVICEIP = '8.8.8.8'

const EOL = '\n'

// 环境变量
// const EOL = WINDOWS
//   ? '\r\n'
//   : '\n'

// const HOSTPATH = WINDOWS
//   ? 'C:/Windows/System32/drivers/etc/hosts'
//   : '/etc/hosts'

const getHostFile = async (filePath: string) => {
  const lines: {[host: string]: string} = {}
  await fs.readFileSync(filePath, { encoding: 'utf8' }).split(/\r?\n/).forEach((line: any) => {
    var lineSansComments = line.replace(/#.*/, '')
    var matches = /^\s*?(.+?)\s+(.+?)\s*$/.exec(lineSansComments)
    if (matches && matches.length === 3) {
      var ip = matches[1]
      var host = matches[2]
      lines[host] = ip
    }
  })
  return lines;
}


// 查询对应IP互联网DNS地址。
const getHostDnsIp = async (env: string) => {
  // 根据环境获取对应的ip
  const host = switchMap[env];
  if (env === 'pre') {
    dns.setServers([PREDNSSERVICEIP])
  } else {
    dns.setServers([PUBLICDNSSERVICEIP])
  }

  try {
    const result = await dnsPromises.resolve4(host);
    return result[0];
  } catch (error) {
    return Promise.reject({
      code: 10000,
      msg: error,
      text: 'dns查询失败'
    })
  }
}

// 修改插入内容
const handleHostFile = (
  hostLine: {[host: string]: string} 
  , hostDnsIp: string = PUBLICDNSSERVICEIP) => {
  // 查找是否有对应的IP
  switchConfig.forEach((item: string) => {
    hostLine[item] = hostDnsIp
  })
  return hostLine;
}

// 写入文件
const writeFile = (lines: {[host: string]: string}) => {
  return new Promise((resolve, reject) => {
    fs.stat(HOSTPATH, async (error, stat) => {
      if (error) {
        reject({
          code: 10001,
          msg: error,
          text: 'fs.stat 文件不存在'
        })
        return
      }
      const streamReslut = fs.createWriteStream(HOSTPATH, { mode: stat.mode })
      streamReslut.on('close', resolve)
      streamReslut.on('error', resolve)

      const hostMap = Object.keys(lines);
      if (hostMap.length !== 0) {
        hostMap.forEach((item: string) => {
          streamReslut.write(`${lines[item]} ${item}\n`)
        })
      }  else {
        streamReslut.write(``)
      }
      
      streamReslut.end()
      resolve()
    })
  })
}

// 检测权限
const checkeAuthority = async () => {
  try {
    await fsPromises.access(HOSTPATH, fs.constants.R_OK | fs.constants.W_OK);
    return Promise.resolve()
  } catch (error) {
    return Promise.reject({
      code: 10002,
      msg: error,
      text: '文件权限检测'
    })
  }
}

// 写入文件处理
const handleWriteFile = async (
  result:{[host: string]: string}
  , resolve: (e?: any) => void
  , reject: (e?: any) => void) => {
  try {
    await writeFile(result);
    resolve()
  } catch (error) {
    reject({
      code: 10003,
      msg: error,
      text: 'writeFile 文件写入权限失败'
    })
  }
}

//  整体处理
const handleHostConfig = (env: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const getFilesResult = await getHostFile(HOSTPATH);
      const resultHostDnsIp = await getHostDnsIp(env);
      const result = handleHostFile(getFilesResult, resultHostDnsIp);
      try {
        await checkeAuthority();
        await handleWriteFile(result, resolve, reject);
      } catch (e) {
        // 修改权限
        const cmd = [
          `echo 211 | sudo -S chmod 777 ${HOSTPATH}`
          // , `echo 211 | sudo -S chmod 644 ${HOSTPATH}`
          // , 'rm -rf ' + tmp_fn
        ].join(' && ')
        exec(cmd, async (error: any, stout: any, stderr) => {
          if (error) {
            reject({
              code: 10004,
              msg: error,
              text: 'exec 执行失败'
            })
          } else {
            await handleWriteFile(result, resolve, reject);
          }
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}

export default () => {
  ipcMain.on('set-local-dns', async (event, env) => {
    try {
      await handleHostConfig(env);
      event.reply('reply-local-dns', 'succeed')
    } catch (e) {
      event.reply('reply-local-dns', e)
    }
  });

  ipcMain.on('set-empty-host', async (event, env) => {
    try {
      await writeFile({})
      event.reply('reply-empty-host', 'succeed')
    } catch (e) {
      event.reply('reply-empty-host', e)
    }
  })
}


