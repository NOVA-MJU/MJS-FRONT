import { GoBold, GoCode, GoHeading, GoImage, GoItalic, GoLink, GoQuote } from 'react-icons/go';
import IconButton from '../../atoms/IconButton';
import { Typography } from '../../atoms/Typography';
import Markdown from 'react-markdown';
import { useEffect, useRef, useState } from 'react';
import { getTempImageFolderUuid } from '../../../api/board';
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * @deprecated
 */
interface MarkdownEditorProps {
  /**
   * 게시글 수정 모드에서 사용할 uuid를 입력하세요
   * 새로운 게시글을 작성하는 경우 입력하지 마세요
   */
  uuid?: string;

  /**
   * 게시글 수정 모드에서 기존 게시글을 로드할 때 입력하세요
   * 새로운 게시글을 작성하는 경우 입력하지 마세요
   */
  initialContent?: string;

  /**
   * 게시글 content가 변경될 때마자 값을 리턴합니다
   * 게시글 길이가 길어질 경우 성능 저하가 발생할 수 있습니다
   */
  onContentChanged: (content: string) => void;
}

/**
 * @deprecated
 * MarkdownEditor

 * v2 MarkdownEditor 삭제 예정
 * 기존에 사용하던 MarkdownEditor를 삭제하고, BlockTextEditor로 변경하세요
 * 
 * @param uuid 게시글 수정 모드인 경우 현재 게시글의 uuid를 이어받아 작업합니다
 * @param initialContent 게시글 수정 모드인 경우 현재 개시글 content를 입력하세요
 * @param onContentChanged 게시글 content를 저장할 state를 입력하세요
 * @returns
 */
export default function MarkdownEditor({
  uuid,
  initialContent,
  onContentChanged,
}: MarkdownEditorProps) {
  const [postUuid, setPostUuid] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentBoxRef = useRef<HTMLTextAreaElement>(null);
  const [imageFolderUuid, setImageFolderUuid] = useState('');
  const [content, setContent] = useState('');
  const [parsedContent, setParsedContent] = useState('');

  /**
   * 게시글이 수정 모드인 경우 해당 게시글의 uuid를 state에 저장합니다
   * 게시글이 수정 모드가 아닌 경우 임의의 uuid를 새로 발급합니다
   */
  useEffect(() => {
    if (uuid) {
      setPostUuid(uuid);
    } else {
      getNewUuid();
    }

    async function getNewUuid() {
      try {
        const res = await getTempImageFolderUuid();
        console.log('새로운 uuid를 발급받았습니다' + res.data);
        setPostUuid(res.data);
      } catch (e) {
        console.error(e);
      }
    }
  }, [uuid]);

  /**
   * 게시글이 수정 모드인 경우 기존 게시글 데이터를 받아서 작업합니다
   */
  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
    }
  }, [initialContent]);

  /**
   * 게시글 작성 편의를 위해 \n 를 \n\n 으로 자동 파싱합니다
   */
  useEffect(() => {
    setParsedContent(normalizeNewlines(content));
  }, [content]);

  /**
   * 게시글 줄바꿈 파싱 함수
   */
  function normalizeNewlines(input: string): string {
    return input
      .replace(/\r\n/g, '\n')
      .replace(/\n/g, '\n\n')
      .replace(/\n{3,}/g, '\n\n');
  }

  /**
   * 게시글 이미지 검색
   */
  const parseContentImages = (): string[] => {
    const regex = /!\[.*?\]\(([^)]+)\)/g;
    const urls: string[] = [];
    let match: RegExpExecArray | null;
    while ((match = regex.exec(content)) !== null) {
      urls.push(match[1]);
    }
    return urls;
  };

  /**
   * heading 추가 function
   */
  const toggleHeading = () => {
    const ta = contentBoxRef.current;
    if (!ta) return;

    const { value, selectionStart: start, selectionEnd: end } = ta;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const nextNL = value.indexOf('\n', start);
    const lineEnd = nextNL < 0 ? value.length : nextNL;

    const prefix = '###' + ' ';
    const line = value.slice(lineStart, lineEnd);
    const added = line.startsWith(prefix);
    const newLine = added ? line.slice(prefix.length) : prefix + line;

    const newVal = value.slice(0, lineStart) + newLine + value.slice(lineEnd);
    ta.value = newVal;
    const pos = added ? start - prefix.length : start + prefix.length;
    ta.setSelectionRange(pos, pos + (end - start));
    ta.focus();

    setContent(newVal);
  };

  /**
   * bold 추가 function
   */
  const toggleBold = () => {
    const ta = contentBoxRef.current;
    if (!ta) return;
    const { value, selectionStart: start, selectionEnd: end } = ta;
    let newStart = start,
      newEnd = end;

    const prefix = value.slice(start - 2, start);
    const suffix = value.slice(end, end + 2);

    if (start >= 2 && end + 2 <= value.length && prefix === '**' && suffix === '**') {
      ta.value = value.slice(0, start - 2) + value.slice(start, end) + value.slice(end + 2);
      newStart = start - 2;
      newEnd = end - 2;
    } else {
      if (start !== end) {
        ta.value = value.slice(0, start) + '**' + value.slice(start, end) + '**' + value.slice(end);
        newStart = start + 2;
        newEnd = end + 2;
      } else {
        ta.value = value.slice(0, start) + '****' + value.slice(start);
        newStart = newEnd = start + 2;
      }
    }

    ta.focus();
    ta.setSelectionRange(newStart, newEnd);

    setContent(ta.value);
  };

  /**
   * italic 추가 function
   */
  const toggleItalic = () => {
    const ta = contentBoxRef.current;
    if (!ta) return;

    const { value, selectionStart: start, selectionEnd: end } = ta;
    let newStart = start,
      newEnd = end;

    const prefix = value.slice(start - 2, start);
    const suffix = value.slice(end, end + 2);

    if (start >= 2 && end + 2 <= value.length && prefix === ' _' && suffix === '_ ') {
      ta.value = value.slice(0, start - 2) + value.slice(start, end) + value.slice(end + 2);
      newStart = start - 2;
      newEnd = end - 2;
    } else {
      if (start !== end) {
        ta.value = value.slice(0, start) + ' _' + value.slice(start, end) + '_ ' + value.slice(end);
        newStart = start + 2;
        newEnd = end + 2;
      } else {
        ta.value = value.slice(0, start) + ' __ ' + value.slice(start);
        newStart = newEnd = start + 2;
      }
    }

    ta.focus();
    ta.setSelectionRange(newStart, newEnd);

    setContent(ta.value);
  };

  /**
   * quote 추가 function
   */
  function handleQuote() {
    const ta = contentBoxRef.current;
    if (!ta) return;
    const { value, selectionStart: pos } = ta;
    const nv = value.slice(0, pos) + '\n\n> ' + value.slice(pos);
    ta.value = nv;
    setContent(nv);
    ta.focus();
    ta.setSelectionRange(pos + 4, pos + 4);
  }

  /**
   * code 추가 function
   */
  function handleCode() {
    const ta = contentBoxRef.current;
    if (!ta) return;
    const { value, selectionStart: pos } = ta;
    const nv = value.slice(0, pos) + '``' + value.slice(pos);
    ta.value = nv;
    setContent(nv);
    ta.focus();
    ta.setSelectionRange(pos + 1, pos + 1);
  }

  /**
   * 하이퍼링크 추가 function
   */
  function handleLink() {
    const ta = contentBoxRef.current;
    if (!ta) return;
    const { value, selectionStart: pos } = ta;
    const nv = value.slice(0, pos) + '[](url)' + value.slice(pos);
    ta.value = nv;
    setContent(nv);
    ta.focus();
    ta.setSelectionRange(pos + 1, pos + 1);
  }

  /**
   * 이미지 드래그 해서 추가
   */
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const ta = contentBoxRef.current!;

    const file = e.dataTransfer.files[0];
    if (!file) return;

    const imgCaption = `\n![업로드중 ${file.name}]()\n`;
    const { selectionStart, selectionEnd, value } = ta;

    ta.value = value.slice(0, selectionStart) + imgCaption + value.slice(selectionEnd);
    ta.selectionStart = ta.selectionEnd = selectionStart + imgCaption.length;
    setContent(normalizeNewlines(ta.value));

    try {
      const imageUrl = await uploadImage(file, imageFolderUuid);

      const successCaption = `\n![${file.name}](${imageUrl})\n`;
      ta.value = value.slice(0, selectionStart) + successCaption + value.slice(selectionEnd);
      ta.selectionStart = ta.selectionEnd = selectionStart + successCaption.length;

      setContent(ta.value);
    } catch (err) {
      console.log(err);

      const errorCaption = `\n![업로드 중 문제가 발생했습니다]()\n`;
      ta.value = value.slice(0, selectionStart) + errorCaption + value.slice(selectionEnd);
      ta.selectionStart = ta.selectionEnd = selectionStart + errorCaption.length;

      setContent(ta.value);
    }

    ta.focus();
  };

  /**
   * 이미지 추가 버튼 클릭
   */
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const ta = contentBoxRef.current!;

    const file = event.target.files?.[0];
    if (!file) return;

    const imgCaption = `\n![업로드중 ${file.name}]()\n`;
    const { selectionStart, selectionEnd, value } = ta;
    ta.value = value.slice(0, selectionStart) + imgCaption + value.slice(selectionEnd);

    ta.selectionStart = ta.selectionEnd = selectionStart + imgCaption.length;
    setContent(normalizeNewlines(ta.value));

    try {
      const imageUrl = await uploadImage(file, imageFolderUuid);

      const successCaption = `\n![${file.name}](${imageUrl})\n`;
      ta.value = value.slice(0, selectionStart) + successCaption + value.slice(selectionEnd);
      ta.selectionStart = ta.selectionEnd = selectionStart + successCaption.length;

      setContent(ta.value);
    } catch (err) {
      console.error(err);

      const errorCaption = `\n![업로드 중 문제가 발생했습니다]()\n`;
      ta.value = value.slice(0, selectionStart) + errorCaption + value.slice(selectionEnd);
      ta.selectionStart = ta.selectionEnd = selectionStart + errorCaption.length;

      setContent(ta.value);
    }

    ta.focus();
  };

  function handleImageUploadClick(): void {
    fileInputRef.current?.click();
  }

  return (
    <div className='h-full flex gap-6'>
      <div className='basis-3/5 flex-shrink-0 flex flex-col gap-3'>
        <div className='flex gap-6 px-6 py-3 bg-grey-05 rounded-xl'>
          <div className='flex gap-3'>
            <IconButton onClick={toggleHeading}>
              <Typography variant='body02' className='text-black'>
                <GoHeading />
              </Typography>
            </IconButton>
            <IconButton onClick={toggleBold}>
              <Typography variant='body02' className='text-black'>
                <GoBold />
              </Typography>
            </IconButton>
            <IconButton onClick={toggleItalic}>
              <Typography variant='body02' className='text-black'>
                <GoItalic />
              </Typography>
            </IconButton>
          </div>
          <hr className='w-0 h-6 border-1 border-grey-10' />
          <div className='flex gap-3'>
            <IconButton onClick={handleQuote}>
              <Typography variant='body02' className='text-black'>
                <GoQuote />
              </Typography>
            </IconButton>
            <IconButton onClick={handleCode}>
              <Typography variant='body02' className='text-black'>
                <GoCode />
              </Typography>
            </IconButton>
            <IconButton onClick={handleLink}>
              <Typography variant='body02' className='text-black'>
                <GoLink />
              </Typography>
            </IconButton>
          </div>
          <hr className='w-0 h-6 border-1 border-grey-10' />
          <div className='flex gap-3'>
            <IconButton onClick={handleImageUploadClick}>
              <Typography variant='body02' className='text-black'>
                <GoImage />
              </Typography>
            </IconButton>
          </div>
        </div>
        <textarea
          className='h-full min-h-48 p-3 placeholder-grey-20 text-[16px] leading-[150%] border-2 border-grey-05 rounded-xl focus:bg-blue-05 focus:outline-none focus:border-blue-05 resize-none'
          placeholder='자유롭게 말을 남겨보세요'
          ref={contentBoxRef}
          onChange={(e) => {
            setContent(e.target.value);
          }}
          onDrop={handleDrop}
          value={content}
        />
      </div>
      <div className='basis-2/5 flex-shrink-0 flex flex-col gap-3'>
        <div className='flex gap-6 px-6 py-2 bg-grey-05 rounded-xl'>
          <Typography variant='title02' className='text-black'>
            미리보기
          </Typography>
        </div>
        <div className='markdown h-full p-3 border-2 border-grey-05 rounded-xl break-all'>
          <Markdown>{parsedContent}</Markdown>
        </div>
      </div>
      <input
        type='file'
        accept='image/*'
        ref={fileInputRef}
        className='hidden'
        onChange={handleImageChange}
      />
    </div>
  );
}
