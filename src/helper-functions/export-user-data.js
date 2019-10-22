const fs = require('fs')
const moment = require('moment')
const path = require('path')
var PdfMake = require('pdfmake')

function newExportEmail (given_name) {
  return (`<div
  style="height:100%;display:table;margin-left:auto;margin-right:auto"
>
  <div style="width:300px">
    <img
      style="display:block;margin-left:auto;margin-right:auto"
      src="https://www.families-share.eu/uploads/images/families_share_logo.png"
    />
      <p style="margin:1rem 0;font-size:1.3rem;color:#565a5c;">
        ${given_name},
          you requested to export all your data. Attached to this email, you will find a pdf containing all your personal information.
      </p>
    </div>
  </div>
</div>`
  )
}

function createPdf (profile, groups, children, events, cb) {
  const fonts = {
    Roboto: {
      normal: path.join(__dirname, '../fonts', 'Roboto-Regular.ttf'),
      bold: path.join(__dirname, '../fonts', 'Roboto-Bold.ttf'),
      italics: path.join(__dirname, '../fonts', 'Roboto-Italic.ttf'),
      bolditalics: path.join(__dirname, '../fonts', 'Roboto-BoldItalic.ttf')
    }
  }
  const printer = new PdfMake(fonts)

  const docDefinition = {
    pageMargins: 50,
    header: {
      columns: [
        {
          text: 'Families Share Platform',
          alignment: 'right',
          opacity: 0.5
        }
      ]
    },
    content: [
      {
        text: 'User Data Export',
        alignment: 'center',
        fontSize: 16,
        margin: [0, 0, 0, 20],
        bold: true
      },
      {
        text: 'Profile',
        fontSize: 14,
        bold: true,
        margin: [0, 0, 0, 20]
      },
      {
        margin: [0, 0, 0, 20],
        columns: [
          {
            width: '40%',
            image: path.join(__dirname, `../..${profile.image.path}`),
            fit: [170, 170]
          },
          {
            width: '60%',
            stack: [
              `Given name: ${profile.given_name}`,
              `Family name: ${profile.family_name}`,
              `Description: ${profile.description ? profile.description : '-'}`,
              `Email: ${profile.email}`,
              `Phone: ${profile.phone ? profile.phone : '-'}`,
              `Address: ${profile.address.city}, ${profile.address.street} ${profile.address.number}`
            ],
            fontSize: 14
          }
        ]
      },
      {
        text: 'Groups',
        fontSize: 14,
        bold: true,
        margin: [0, 0, 0, 20]
      },
      {
        margin: [0, 0, 0, 20],
        ol: groups.map(group => ({
          text: `${group.name}: ${group.description}`,
          fontSize: 14
        }))
      },
      {
        text: 'Children',
        fontSize: 14,
        bold: true,
        margin: [0, 0, 0, 20]
      },
      ...children.map(child => ({
        margin: [0, 0, 0, 20],
        columns: [
          {
            width: '40%',
            image: path.join(__dirname, `../..${child.image.path}`),
            fit: [170, 170]
          },
          {
            width: '60%',
            stack: [
              `Given name: ${child.given_name}`,
              `Family name: ${child.family_name}`,
              `Gender: ${child.gender}`,
              `Email: ${profile.email}`,
              `Birthday: ${moment(child.birthdate).format('DD MMMM YYYY')}`,
              `Allergies: ${child.allergies ? child.allergies : '-'}`,
              `Special Needs: ${child.special_needs ? child.special_needs : '-'}`,
              `Other Info: ${child.other_info ? child.other_info : '-'}`
            ],
            fontSize: 14
          }
        ]
      })),
      {
        text: 'Activities',
        fontSize: 14,
        bold: true,
        margin: [0, 0, 0, 20]
      },
      {
        margin: [0, 0, 0, 20],
        ol: events.map(event => ({
          text: `${event.summary}: ${event.description}`,
          fontSize: 14
        }))
      }

    ]
  }
  const pdfDoc = printer.createPdfKitDocument(docDefinition)
  pdfDoc.pipe(fs.createWriteStream(`${profile.given_name.toUpperCase()}_${profile.family_name.toUpperCase()}.pdf`))
  pdfDoc.end()
  cb()
}

module.exports = {
  newExportEmail: newExportEmail,
  createPdf: createPdf
}
